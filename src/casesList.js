const express = require('express');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
const casesList = express();

casesList.get('/:id?', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err) return console.log(err);

        if (!req.params.id) {
            const casesQuery = await client.db('casesim').collection('cases').find({}).toArray();
            const cases = casesQuery.map(({ _id, id, name, avatar, price }) => ({ key: _id, id, name, avatar, price }));
            res.status(200).json(cases);
        } else {
            res.status(200).json("One case");
        }
    });
});


module.exports = casesList;