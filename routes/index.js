const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const loginController = require('../controllers/login');
const isNewUser = require('../config/isNewUser');

// Home/Index route
router.get('/', indexController.index);

// Google OAuth login route
router.get('/auth/google', loginController.login);

// Google OAuth callback route
router.get('/oauth2callback', loginController.callback);

// OAuth logout route
router.get('/logout', loginController.logout);

module.exports = router;
