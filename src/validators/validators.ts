import { Router } from 'express'
import usernameExists from './usernameExists/usernameExists'

const validators = Router();
validators.use('/usernameExists/', usernameExists);

export default validators