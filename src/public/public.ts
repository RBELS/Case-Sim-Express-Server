import { DropType } from './../types/dropsTypes';
import { Router } from "express"
import img from "./img/img"

const MAX_NUMBER = 20;
const Public = Router();

Public.use('/img/', img);

Public.get('/', (req, res) => {
    res.send('/public/');
})

Public.get('/header/:rowid?', async(req, res) => {
    const { drops } = req.app.locals;

    const rowid = req.params.rowid;
    let dropsArray: DropType[];

    if (rowid) {
        dropsArray = await drops.find(rowid ? { rowid: { $gt: parseInt(rowid) } } : {}).sort({ _id: -1 }).toArray();
    } else {
        dropsArray = await drops.find().sort({ _id: -1 }).limit(MAX_NUMBER).toArray();
    }

    const headerDrops = dropsArray.map(drop => ({
        ...drop,
        _id: undefined,
        chance: undefined,
        sold: undefined
    }));

    res.status(200).json(headerDrops).end();
})

export default Public