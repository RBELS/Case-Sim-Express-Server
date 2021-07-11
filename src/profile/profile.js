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

// URL EXAMPLE
// http://192.168.1.34:5000/profile/drops/rebel/1?caseId=1&rarity=3&notSold=false
profile.get('/drops/:username/:page', async(req, res) => {
    const { drops } = req.app.locals;

    const NUM = 20;
    const usernameParam = req.params.username;
    const page = req.params.page;

    //urldata for sorting
    const caseId = parseInt(req.query.caseId);
    const rarity = parseInt(req.query.rarity);
    const notSold = parseBoolean(req.query.notSold);

    console.log(caseId);

    const dropsArray = await drops.find({
        user: usernameParam
    }).sort({ rowid: -1 }).toArray();

    const paginatedDrops = filterDropsArray(dropsArray, caseId, rarity, notSold).slice(NUM * (page - 1), NUM * page);

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

const parseBoolean = str => {
    if(str === 'false') {
        return false;
    } else if(str === 'true') {
        return true;
    } else {
        return undefined;
    }
}

const filterDropsArray = (array, caseId, rarity, notSold) => {
    const newArray = array.filter(item => {
        debugger
        if((item.caseid === caseId || (isNaN(caseId) || caseId === undefined))) {

        } else {
            return false;
        }
        if(item.quality === rarity || (isNaN(caseId) || caseId === undefined)) {

        } else {
            return false;
        }


        if(notSold && item.sold) {
            return false;
        }


        return true;
    })
    return newArray;
}

module.exports = profile;
module.exports.isItMe = isItMe;