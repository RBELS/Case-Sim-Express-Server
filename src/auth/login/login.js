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
                const userToken = CryptoJS.AES.encrypt(JSON.stringify({ username: currentUser.username, password: currentUser.password }), secretKey).toString();
                res.cookie('userToken', userToken, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
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

login.get('/', (req, res) => {
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

login.delete('/', (req, res) => {
    // res.cookie('userToken', userToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
    res.clearCookie('userToken');
    res.status(200).end();
});

module.exports = login;