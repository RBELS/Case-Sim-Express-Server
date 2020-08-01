const express = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../secret');
const { MongoClient } = require('mongodb');
const amlogged = express();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

amlogged.get('/', (req, res) => {
    const userToken = req.cookies.userToken;
    if (userToken) {
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        mongoClient.connect(async(err, client) => {
            if (err)
                return console.log(err);
            const userFound = await client.db('casesim').collection('users').findOne({ username, password });
            if (userFound) {
                res.status(200).json({ success: true }).end();
            } else {
                res.status(200).json({ success: false }).end();
            }
        })
    } else {
        res.status(200).json({ success: false }).end();
    }
})

module.exports = amlogged;