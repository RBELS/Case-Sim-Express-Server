const { Router } = require('express');

const MAX_NUMBER = 20;
const public = new Router();

public.get('/', (req, res) => {
    res.send('/public/');
})

public.get('/header/:rowid?', async(req, res) => {
    const { drops } = req.app.locals;

    const rowid = req.params.rowid;
    let dropsArray;

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

module.exports = public;