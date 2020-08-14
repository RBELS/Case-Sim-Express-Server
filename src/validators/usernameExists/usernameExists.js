const { Router } = require('express');

const usernameExists = new Router();

usernameExists.post('/', async(req, res) => {
    const { users } = req.app.locals;

    const { username } = req.body;

    if (!username) {
        res.status(400).json({ success: false, error: 'Wrong input.' }).end();
        return;
    }

    const user = await users.findOne({ username });
    res.status(200).json({ success: true, exists: user ? true : false });
});

module.exports = usernameExists;