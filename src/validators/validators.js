const { Router } = require('express');
const usernameExists = require('./usernameExists/usernameExists');

const validators = new Router();
validators.use('/usernameExists/', usernameExists);

module.exports = validators;