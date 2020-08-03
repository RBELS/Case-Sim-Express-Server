const express = require('express');
const cors = require('cors');
const casesList = require('./casesList');
const auth = require('./auth/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const profile = require('./profile/profile');
const Case = require('./case/case');


const app = express();
const PORT = 5000;
const PROD = false;

app.use(cors({
    origin: 'http://25.40.173.182:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/cases/', casesList);
app.use('/auth/', auth);
app.use('/profile/', profile);
app.use('/open/', Case);

app.listen(PORT);