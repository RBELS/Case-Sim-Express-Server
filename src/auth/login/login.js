const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../secret');

const login = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });


login.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ success: false }).end();
    } else {
        mongoClient.connect(async(err, client) => {
            if (err) return console.log(err);

            const currentUser = await client.db('casesim').collection('users').findOne({ username });
            if (currentUser && password === CryptoJS.AES.decrypt(currentUser.password, secretKey).toString(CryptoJS.enc.Utf8)) {
                const userToken = CryptoJS.AES.encrypt(JSON.stringify(currentUser), secretKey).toString();
                res.cookie('userToken', userToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
                res.status(200).json({
                    success: true
                }).end();
            } else {
                res.status(200).json({
                    success: false
                }).end();
            }

        })
    }
})

module.exports = login;