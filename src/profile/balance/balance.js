const { Router } = require('express');
const express = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../../auth/secret');

const balance = Router();

balance.post('/', async(req,res) => {
    const ADD_NUMBER = 10;
    const { users } = req.app.locals;
    const userToken = req.cookies.userToken;
    if(!userToken) {
        res.status(401).json({ success: false, error: 'You are not logged in.' }).end();
        return;
    }
    const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
    const reqUser = await users.findOne({ username, password });
    if(!reqUser) {
        res.status(400).json({ success: false, error: 'Bad request.' }).end();
        return;
    }

    //reqUser.balance
    users.findOneAndUpdate({ username: reqUser.username, password: reqUser.password }, { '$inc': { balance: ADD_NUMBER } });
    res.status(200).json({ success: true, addNumber: ADD_NUMBER }).end();
});

module.exports = balance;