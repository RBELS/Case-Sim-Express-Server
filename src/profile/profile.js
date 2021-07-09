const { Router } = require('express');
const username = require('./username/username');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../auth/secret');
const balance = require('./balance/balance');


const profile = new Router();

profile.use('/username/', username);
profile.use('/balance/', balance);

profile.get('/', (req, res) => {
    res.status(200).send('Index of Profile.').end();
})

profile.get('/info/:username', async(req, res) => {
    const { users } = req.app.locals;

    const usernameParam = req.params.username;

    const userIn = await users.findOne({ username: usernameParam });
    if (!userIn) {
        res.status(200).json({ success: false }).end();
        return;
    }

    const myProfile = await isItMe(usernameParam, req.cookies.userToken, users);

    res.status(200).json({
        success: true,
        username: userIn.username,
        balance: myProfile ? userIn.balance : undefined,
        myProfile,
    }).end();
})

profile.get('/drops/:username/:page', async(req, res) => {
    const { drops } = req.app.locals;

    const NUM = 20;
    const usernameParam = req.params.username;
    const page = req.params.page;

    const dropsArray = await drops.find({ user: usernameParam }).sort({ rowid: -1 }).toArray();

    const paginatedDrops = dropsArray.slice(NUM * (page - 1), NUM * page);

    res.json(paginatedDrops);
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