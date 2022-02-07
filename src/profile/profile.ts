import { DropType } from './../types/dropsTypes';
import { Collection } from 'mongodb';
import { UserType } from './../types/usersTypes';
import { Request, Router } from "express"
import username from "./username/username"
import CryptoJS from "crypto-js"
import { secretKey } from "../auth/secret"
import balance from "./balance/balance"


const profile = Router();

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

interface ProfileDropsQueryI {
    caseId: string
    rarity: string
    notSold: string
    lastRowid: string
}

interface ProfileDropsParamsI {
    username: string
}

// URL EXAMPLE
// http://192.168.1.34:5000/profile/drops/rebel/1?caseId=1&rarity=3&notSold=false
profile.get('/drops/:username', async(req: Request<ProfileDropsParamsI, {}, {}, ProfileDropsQueryI>, res) => {
    const { drops } = req.app.locals;

    const NUM = 20;//Number of drops on every page
    const usernameParam = req.params.username;

    //urldata for sorting
    const caseId = parseInt(req.query.caseId);
    const rarity = parseInt(req.query.rarity);
    const notSold = parseBoolean(req.query.notSold);
    const lastRowid: number = parseInt(req.query.lastRowid);


    const dropsArray = await drops.find({
        user: usernameParam
    }).sort({ rowid: -1 }).toArray();

    const paginatedDrops = filterDropsArray(dropsArray, caseId, rarity, notSold, lastRowid).splice(0, NUM);

    res.json(paginatedDrops);
})

export const isItMe = async(usernameParam: string, userToken: string, users: Collection<UserType>): Promise<boolean> => {
    let result = false;
    if (userToken) {
        const { username, password } = JSON.parse(CryptoJS.AES.decrypt(userToken, secretKey).toString(CryptoJS.enc.Utf8));
        if (username && password) {
            const authUser = await users.findOne({ username, password });
            if (authUser?.username === usernameParam) {
                result = true;
            }
        }
    }
    return result;
}

const parseBoolean = (str: string): boolean | undefined => {
    if(str === 'false') {
        return false;
    } else if(str === 'true') {
        return true;
    } else {
        return undefined;
    }
}

const filterDropsArray = (array: DropType[], caseId: number, rarity: number, notSold: boolean | undefined, lastRowid: number): DropType[] => {
    const newArray = array.filter(item => {
        // debugger
        if((item.caseid === caseId || (isNaN(caseId) || caseId === undefined))) {

        } else {
            return false;
        }
        if(item.quality === rarity || (isNaN(rarity) || rarity === undefined)) {

        } else {
            return false;
        }
        if(lastRowid !== -1 && item.rowid >= lastRowid) {
            return false;
        }


        if(notSold && item.sold) {
            return false;
        }


        return true;
    })
    return newArray;
}

export default profile