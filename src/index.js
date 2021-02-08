const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const casesList = require('./casesList');
const auth = require('./auth/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const profile = require('./profile/profile');
const Case = require('./case/case');
const validators = require('./validators/validators');
const public = require('./public/public');
const items = require('./items/items');


const app = express();
const PORT = 5000;
const PROD = false;

app.use(cors({
    // origin: 'http://25.40.173.182:3000',
    origin: 'http://192.168.1.34:3000',
    // origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/cases/', casesList);
app.use('/auth/', auth);
app.use('/profile/', profile);
app.use('/open/', Case);
app.use('/validators/', validators);
app.use('/public/', public);
app.use('/items/', items);

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
mongoClient.connect(async(err, client) => {
    if (err) {
        return console.log(err.stack);
    }
    app.locals.users = client.db('casesim').collection('users');
    app.locals.cases = client.db('casesim').collection('cases');
    app.locals.drops = client.db('casesim').collection('drops');

    app.listen(PORT, () => {
        console.log(`App started on http://localhost:${PORT}`);
    })
});