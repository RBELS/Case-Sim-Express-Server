const { Router } = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../secret');

const login = new Router();


login.post('/', async(req, res) => {
    const { username, password } = req.body;
    const { users } = req.app.locals;

    if (!username || !password) {
        res.status(400).json({ success: false }).end();
        return;
    }

    const currentUser = await users.findOne({ username });
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

login.get('/', async(req, res) => {
    const { users } = req.app.locals;

    const userToken = req.cookies.userToken;
    if (!userToken) {
        res.status(200).json({ success: false }).end();
        return
    }


    const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
    const userFound = await users.findOne({ username, password });
    if (userFound) {
        res.status(200).json({ success: true }).end();
    } else {
        res.status(200).json({ success: false }).end();
    }
})

login.delete('/', (req, res) => {
    res.clearCookie('userToken');
    res.status(200).end();
});

module.exports = login;