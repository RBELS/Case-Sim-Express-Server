const express = require('express');
const username = require('./username/username');

const profile = express();

profile.use('/username/', username);

profile.get('/', (req, res) => {
    res.status(200).send('Index of Profile.').end();
})

module.exports = profile;