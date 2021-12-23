import { Router } from "express";
import login from "./login/login";
import register from "./register/register";

const auth = Router();

auth.use('/login/', login);
auth.use('/register/', register);


auth.get('/', (req, res) => {
    res.status(200).send("Index of auth");
});


export default auth