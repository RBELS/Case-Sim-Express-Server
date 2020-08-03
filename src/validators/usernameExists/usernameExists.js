const express = require('express');
const { MongoClient } = require('mongodb');

const usernameExists = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

usernameExists.post('/', (req, res) => {
    mongoClient.connect(async(err, client) => {
        if (err)
            return console.log(err);
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ success: false, error: 'Wrong input.' }).end();
            return;
        }

        const user = await client.db('casesim').collection('users').findOne({ username });
        res.status(200).json({ success: true, exists: user ? true : false })
    });
});

module.exports = usernameExists;