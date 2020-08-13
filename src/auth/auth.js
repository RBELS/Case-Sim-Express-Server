const express = require('express');
const login = require('./login/login');
const register = require('./register/register');

const auth = express();

auth.use('/login/', login);
auth.use('/register/', register);


auth.get('/', (req, res) => {
    res.status(200).send("Index of auth");
});


module.exports = auth;