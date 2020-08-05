const express = require('express');
const { MongoClient } = require('mongodb');
const { baseImgUrl } = require('../instances');
const MAX_CHANCE_NUMBER = 100;

const Case = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

Case.get('/:caseid', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err)
            return console.log(err);
        const caseid = parseInt(req.params.caseid);
        const thisCase = await client.db('casesim').collection('cases').findOne({ id: caseid });
        if (!thisCase) {
            res.status(404).json({ error: 'No such case.' });
            return;
        }
        const items = thisCase.items;

        const randomItem = openCase(items);

        randomItem.avatar = `${baseImgUrl}/img/${thisCase.name}/${randomItem.id}.${thisCase.ext}`;

        res.json(randomItem);
    });

});


const openCase = (items) => {
    // let random = Math.random() * maxChance;
    let random = Math.random() * calculateMaxChance(items);

    for (let i = 0; i < items.length; i++) {
        if (random <= items[i].chance) {
            return items[i];
        }
        random -= items[i].chance;
    }
}

const calculateMaxChance = items => {
    let max = 0;
    for (let i = 0; i < items.length; i++) {
        max += items[i].chance;
    }
    return max;
}


module.exports = Case;