import { Router } from "express";
import CryptoJS from "crypto-js";
import { secretKey } from "../../auth/secret";


const username = Router();

username.get('/', (req, res) => {
    const userToken: string | undefined = req.cookies.userToken;
    if (!userToken) {
        res.json({ success: false, error: 'You are not logged.' }).end();
    } else {
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        res.json({ success: true, username }).end();
    }
});
export default username