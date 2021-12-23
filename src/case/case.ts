import { CaseItemType, SendItemType } from './../types/casesTypes';
import { Router } from "express";
import { baseImgUrl } from "../instances";
import CryptoJS from "crypto-js";
import { secretKey } from "../auth/secret";

const Case = Router();

Case.get('/:caseid', async(req, res) => {
    const { users, cases, drops } = req.app.locals;

    const caseid = parseInt(req.params.caseid);
    const thisCase = await cases.findOne({ id: caseid });
    if (!thisCase) {
        res.status(200).json({ success: false, error: 'No such case.' });
        return;
    }
    let randomItem;

    const userToken = req.cookies.userToken;
    if (!userToken) {
        res.status(200).json({ success: false, error: 'You are not logged.' }).end();
        return;
    }


    const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8)); //{ username, password }
    const foundUser = await users.findOne({ username, password });
    const last = await drops.find().sort({ _id: -1 }).toArray();

    let rowid: number;
    if (!last[0]) {
        rowid = 0;
    } else {
        rowid = last[0].rowid + 1;
    }

    if (!foundUser) {
        res.status(200).json({ success: false, error: 'You are not logged.' }).end();
        return;
    }
    if (thisCase.price > foundUser.balance) {
        res.status(200).json({ success: false, error: 'Not enough bucks.' }).end();
        return;
    }

    const items = thisCase.items;
    randomItem = openCase(items);
    if (!randomItem) {
        res.status(404);
        return;
    }

    let sendItem: SendItemType = {
        ...randomItem,
        avatar: `${baseImgUrl}/img/${thisCase.name}/${randomItem.id}.${thisCase.ext}`,
        rowid,
        sold: false
    }
    users.findOneAndUpdate({ username: foundUser.username, password: foundUser.password }, { '$inc': { balance: -1 * thisCase.price } });
    const insertCaseAvatar = thisCase.avatar[0] === '/' ? baseImgUrl + thisCase.avatar : thisCase.avatar;
    drops.insertOne({...sendItem, user: username, sold: false, caseid: thisCase.id, caseavatar: insertCaseAvatar, rowid });


    res.json({ success: true, item: sendItem });
});

const openCase = (items: CaseItemType[]): CaseItemType | undefined => {
    let random = Math.random() * calculateMaxChance(items);

    for (let i = 0; i < items.length; i++) {
        if (random <= items[i].chance) {
            return items[i];
        }
        random -= items[i].chance;
    }

}

const calculateMaxChance = (items: CaseItemType[]) => {
    let max = 0;
    for (let i = 0; i < items.length; i++) {
        max += items[i].chance;
    }
    return max;
}

export default Case