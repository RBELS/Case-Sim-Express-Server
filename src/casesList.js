const express = require('express');
const { MongoClient } = require('mongodb');
const { baseImgUrl } = require('./instances');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
const casesList = express();

casesList.get('/:id?', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) return console.log(err);

        if (!req.params.id) {
            const cases = await client.db('casesim').collection('cases').find({}).toArray();
            // const cases = casesQuery.map(({ _id, id, name, avatar, price }) => ({ key: _id, id, name, avatar, price }));
            res.status(200).json(cases);
        } else {
            const caseid = parseInt(req.params.id);
            const caseObj = await client.db('casesim').collection('cases').findOne({ id: caseid });
            if (!caseObj) res.status(404).json({
                error: "Error 404: Not Found."
            }).end();



            res.status(200).json({
                ...caseObj,
                items: caseObj.items.map((item => ({...item, avatar: `${baseImgUrl}/img/${caseObj.name}/${item.id}.png` })))
            });
        }
    });
});


module.exports = casesList;