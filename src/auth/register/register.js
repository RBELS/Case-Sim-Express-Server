const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../secret');

const register = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

register.get('/', (req, res) => {
    const { username, password } = req.query;
    const incorrectInput = !username || !password || username.length < 3 || username.length > 20 || password.length < 8 || password.length > 20;
    if (incorrectInput) {
        res.status(400).json({ success: false }).end();
    } else {
        mongoClient.connect(async(err, client) => {
            if (err) return console.log(err);

            const userExists = await client.db('casesim').collection('users').findOne({ username });
            if (userExists) {
                res.status(200).json({ success: false }).end();
            } else {
                const passwordToken = CryptoJS.AES.encrypt(password, secretKey).toString();
                const { ops: [newUser] } = await client.db('casesim').collection('users').insertOne({ username, password: passwordToken });

                const userToken = CryptoJS.AES.encrypt(JSON.stringify(newUser), secretKey).toString();
                res.cookie('userToken', userToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
                res.status(200).json({ success: true }).end();
            }
        });
    }
})

module.exports = register;