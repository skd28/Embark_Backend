const express = require('express');
const { signupUser, loginUser } = require('../controller');
const routes = express.Router();


routes.post('/login',loginUser)

routes.post('/signup',signupUser)

 module.exports = routes;