const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../auth/secret');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

const items = express();

items.post('/sell/', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) {
            return console.log(err);
        }
        const userToken = req.cookies.userToken;
        if (!userToken) {
            res.status(200).json({ success: false, error: 'You are not logged in.' });
            return;
        }
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        const reqUser = await client.db('casesim').collection('users').findOne({ username, password });
        if (!reqUser) {
            res.status(200).json({ success: false, error: 'You are not logged in.' });
            return;
        }

        const rowid = parseInt(req.body.rowid);
        const reqDrop = await client.db('casesim').collection('drops').findOne({ rowid });
        if (!reqDrop) {
            res.status(200).json({ success: false, error: 'This drop does not exist.' });
            return;
        }

        if (reqDrop.user !== reqUser.username) {
            res.status(200).json({ success: false, error: 'You can sell only your items.' });
            return;
        }

        if (reqDrop.sold) {
            res.status(200).json({ success: false, error: 'This item is already sold.' });
            return;
        }

        client.db('casesim').collection('users').findOneAndUpdate({ username: reqUser.username, password: reqUser.password }, { '$inc': { balance: reqDrop.price } });
        client.db('casesim').collection('drops').findOneAndUpdate({ rowid: reqDrop.rowid }, { '$set': { sold: true } });
        res.status(200).json({ success: true, price: reqDrop.price });
        //{ username: foundUser.username, password: foundUser.password }, { '$inc': { balance: -1 * thisCase.price } }
    });
});

module.exports = items;