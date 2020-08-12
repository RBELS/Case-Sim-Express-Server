const express = require('express');
const username = require('./username/username');
const { baseImgUrl } = require('../instances');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../auth/secret');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

const profile = express();

profile.use('/username/', username);

profile.get('/', (req, res) => {
    res.status(200).send('Index of Profile.').end();
})

profile.get('/info/:username', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) {
            return console.log(err);
        }
        const usernameParam = req.params.username;

        const userIn = await client.db('casesim').collection('users').findOne({ username: usernameParam });
        if (!userIn) {
            res.status(200).json({ success: false }).end();
            return;
        }

        const myProfile = await isItMe(usernameParam, req.cookies.userToken, client.db('casesim').collection('users'));

        res.status(200).json({
            success: true,
            username: userIn.username,
            balance: myProfile ? userIn.balance : undefined,
            myProfile,
        }).end();
    });
})

profile.get('/drops/:username/:page', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) {
            return console.log(err);
        }
        const NUM = 20;
        const usernameParam = req.params.username;
        const page = req.params.page;

        const drops = await client.db('casesim').collection('drops').find({ user: usernameParam }).sort({ rowid: -1 }).toArray();

        const paginatedDrops = drops.slice(NUM * (page - 1), NUM * page);

        res.json(paginatedDrops);
    });
})

const isItMe = async(usernameParam, userToken, users) => {
    let result = false;
    if (userToken) {
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        if (username && password) {
            const authUser = await users.findOne({ username, password });
            if (authUser.username === usernameParam) {
                result = true;
            }
        }
    }
    return result;
}

module.exports = profile;
module.exports.isItMe = isItMe;