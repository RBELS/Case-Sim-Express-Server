const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('./secret');
const e = require('express');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
const auth = express();
auth.use(session({
    secret: "Artyom",
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60 * 60 * 24
    },
    resave: false,
    saveUninitialized: false
}));


auth.get('/login/', (req, res) => {
    //get support. Then reafactor for post requests. body-parser and etc.
    const { username, password } = req.query;
    //get support. Then reafactor for post requests. body-parser and etc.
    if (!username || !password) {
        res.status(400).json({ success: false }).end();
    } else {
        mongoClient.connect(async(err, client) => {
            if (err) return console.log(err);

            const currentUser = await client.db('casesim').collection('users').findOne({ username });

            if (currentUser && password == CryptoJS.AES.decrypt(currentUser.password, secretKey).toString(CryptoJS.enc.Utf8)) {
                req.session.userToken = CryptoJS.AES.encrypt(JSON.stringify(currentUser), secretKey).toString();

                res.status(200).json({
                    success: true
                }).end();
            } else {
                res.status(400).json({
                    success: false
                }).end();
            }

        })
    }
});

auth.get('/amLogged/', (req, res) => {
    const userToken = req.session.userToken;
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

});

auth.get('/register/', (req, res) => {
    const { username, password } = req.query;
    const incorrectInput = !username || !password || username.length < 3 || username.length > 20 || password.length < 8 || password.length > 20;
    if (incorrectInput) {
        res.status(400).json({ success: false }).end();
    } else {
        mongoClient.connect(async(err, client) => {
            if (err) return console.log(err);

            const userExists = await client.db('casesim').collection('users').findOne({ username });
            if (userExists) {
                res.status(400).json({ success: false }).end();
            } else {
                const passwordToken = CryptoJS.AES.encrypt(password, secretKey).toString();
                const { ops: [newUser] } = await client.db('casesim').collection('users').insertOne({ username, password: passwordToken });

                req.session.userToken = CryptoJS.AES.encrypt(JSON.stringify(newUser), secretKey).toString();
                res.status(200).json({ success: true }).end();
            }
        });
    }
});

auth.get('/', (req, res) => {
    res.status(200).send("Index of auth");
});

module.exports = auth;