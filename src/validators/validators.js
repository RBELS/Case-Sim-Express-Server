const express = require('express');
const usernameExists = require('./usernameExists/usernameExists');

const validators = express();
validators.use('/usernameExists/', usernameExists);

module.exports = validators;