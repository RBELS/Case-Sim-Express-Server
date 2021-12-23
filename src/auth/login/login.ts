import { UserType } from './../../types/usersTypes';
import { Router } from "express";
import CryptoJS from "crypto-js";
import { secretKey } from "../secret";

const login = Router();


login.post('/', async(req, res) => {
    const { username, password } = req.body;
    const { users } = req.app.locals;

    if (!username || !password) {
        res.status(400).json({ success: false }).end();
        return;
    }

    const currentUser: UserType = await users.findOne({ username });
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

    const userToken: string = req.cookies.userToken;
    if (!userToken) {
        res.status(200).json({ success: false }).end();
        return
    }


    const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
    const userFound: UserType = await users.findOne({ username, password });
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

export default login