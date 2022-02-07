const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
mongoClient.connect(async (err, client) => {
    if (err) {
        return console.log(err.stack);
    }
    else if (!client) {
        return console.log('Client is undefined in index.ts');
    }
    const users = client.db('casesim').collection('users');
    
    const { insertedId } = await users.insertOne({ username: 'testName', password: 'testPassword', balance: 10 })
    console.log(insertedId)
    console.log(insertedId.toHexString())
});
