const express = require('express');
const { MongoClient } = require('mongodb');
const { baseImgUrl } = require('../instances');
const CryptoJS = require('crypto-js');
const { secretKey } = require('../auth/secret');

const MAX_NUMBER = 20;
const public = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

public.get('/', (req, res) => {
    res.send('/public/');
})

public.get('/header/:rowid?', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) {
            return console.log(err);
        }
        const rowid = req.params.rowid;
        let drops;
        debugger
        if (rowid) {
            drops = await client.db('casesim').collection('drops').find({ rowid: { $gt: parseInt(rowid) } }).sort({ _id: -1 }).toArray();
        } else {
            drops = await client.db('casesim').collection('drops').find().sort({ _id: -1 }).limit(MAX_NUMBER).toArray();
        }

        const headerDrops = drops.map(drop => ({
            ...drop,
            _id: undefined,
            chance: undefined,
            sold: undefined
        }));

        res.status(200).json(headerDrops).end();
    });
})

module.exports = public;