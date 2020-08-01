const express = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../../auth/secret');


const username = express();

username.get('/', (req, res) => {
    const userToken = req.cookies.userToken;
    if (!userToken) {
        res.json({ success: false, error: 'You are not logged.' }).end();
    } else {
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        res.json({ success: true, username }).end();
    }
});

module.exports = username;