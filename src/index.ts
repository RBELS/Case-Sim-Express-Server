import express from 'express'
import cors from 'cors'
import { Collection, Document, MongoClient } from 'mongodb'
import casesList from './casesList'
import auth from './auth/auth'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import profile from './profile/profile'
import Case from './case/case'
import validators from './validators/validators'
import Public from './public/public'
import items from './items/items'


const PORT = 5001;
const PROD = false;
const DB_NAME = 'casesim';

export const app = express();

app.use(cors({
    // origin: 'http://25.40.173.182:3000',
    // origin: 'http://192.168.1.34:3000',
    // origin: 'http://192.168.1.34:3001',
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/cases/', casesList);
app.use('/auth/', auth);
app.use('/profile/', profile);
app.use('/open/', Case);
app.use('/validators/', validators);
app.use('/public/', Public);
app.use('/items/', items);

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
mongoClient.connect(async(err, client) => {
    if (err) {
        return console.log(err.stack);
    } else if (!client) {
        return console.log('Client is undefined in index.ts')
    }

    app.locals.users = client.db(DB_NAME).collection('users');
    app.locals.cases = client.db(DB_NAME).collection('cases');
    app.locals.drops = client.db(DB_NAME).collection('drops');

    app.listen(PORT, () => {
        console.log(`App started on http://localhost:${PORT}`);
    })
});

