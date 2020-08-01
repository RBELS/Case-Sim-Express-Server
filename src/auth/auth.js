const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');
const { secretKey } = require('./secret');
const amlogged = require('./amlogged/amlogged');
const login = require('./login/login');
const register = require('./register/register');

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
const auth = express();

auth.use('/amlogged/', amlogged);
auth.use('/login/', login);
auth.use('/register/', register);


auth.get('/', (req, res) => {
    res.status(200).send("Index of auth");
});


module.exports = auth;