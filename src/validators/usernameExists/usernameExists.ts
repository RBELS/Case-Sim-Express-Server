import { Request, Router } from 'express'

const usernameExists = Router();

type UsernameExistsRequestType = {
    username: string
}

usernameExists.post('/', async(req: Request<any, any, UsernameExistsRequestType>, res) => {
    const { users } = req.app.locals;

    const { username } = req.body;

    if (!username) {
        res.status(400).json({ success: false, error: 'Wrong input.' }).end();
        return;
    }

    const user = await users.findOne({ username });
    res.status(200).json({ success: true, exists: user ? true : false });
});

export default usernameExists