const express = require('express');
const cors = require('cors');
const casesList = require('./casesList');
const auth = require('./auth/auth');
const session = require('express-session')
const { sessionSecretKey } = require('./auth/secret');


const app = express();
const PORT = 5000;
const PROD = false;

app.use(cors({
    origin: "http://25.40.173.182:3000",
    credentials: true
}));

const sessionConfig = {
    secret: "Artyom Belsky",
    cookie: {
        secure: PROD,
        httpOnly: PROD,
        maxAge: 60 * 60 * 24 * 7
    },
    saveUninitialized: false,
    resave: false
};

// app.use();


app.use('/cases/', casesList);
app.use('/auth/', auth);

app.listen(PORT);

module.exports.sessionConfig = sessionConfig;