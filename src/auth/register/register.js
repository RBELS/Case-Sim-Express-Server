const { Router } = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../secret');

const register = new Router();

register.post('/', async(req, res) => {
    const { users } = req.app.locals;

    const { username, password } = req.body;
    const incorrectInput = !username || !password || username.length < 3 || username.length > 20 || password.length < 8 || password.length > 20;
    if (incorrectInput) {
        res.status(400).json({ success: false }).end();
        return;
    }

    const userExists = await users.findOne({ username });
    if (userExists) {
        res.status(200).json({ success: false }).end();
        return;
    }
    const passwordToken = CryptoJS.AES.encrypt(password, secretKey).toString();
    const { ops: [newUser] } = await users.insertOne({ username, password: passwordToken, balance: 300 });

    const userToken = CryptoJS.AES.encrypt(JSON.stringify({ username: newUser.username, password: newUser.password }), secretKey).toString();
    res.cookie('userToken', userToken, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
    res.status(200).json({ success: true }).end();


})

module.exports = register;