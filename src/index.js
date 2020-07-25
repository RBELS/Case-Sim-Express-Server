const express = require('express');
const cors = require('cors');
const casesList = require('./casesList');


const app = express();
const PORT = 5000;

app.use(cors({
    origin: "http://25.40.173.182:3000",
    credentials: true
}));
app.use('/cases/', casesList);

app.listen(PORT);