const { Router } = require('express');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../auth/secret');

const items = new Router();

items.post('/sell/', async(req, res) => {
    const { users, cases, drops } = req.app.locals;

    const userToken = req.cookies.userToken;
    if (!userToken) {
        res.status(200).json({ success: false, error: 'You are not logged in.' });
        return;
    }
    const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
    const reqUser = await users.findOne({ username, password });
    if (!reqUser) {
        res.status(200).json({ success: false, error: 'You are not logged in.' });
        return;
    }

    const rowid = parseInt(req.body.rowid);
    const reqDrop = await drops.findOne({ rowid });
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

    users.findOneAndUpdate({ username: reqUser.username, password: reqUser.password }, { '$inc': { balance: reqDrop.price } });
    drops.findOneAndUpdate({ rowid: reqDrop.rowid }, { '$set': { sold: true } });
    res.status(200).json({ success: true, price: reqDrop.price });
});

module.exports = items;