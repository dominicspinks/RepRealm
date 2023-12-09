const express = require('express');
const router = express.Router();

const profilesController = require('../controllers/profiles');
const isNewUser = require('../config/isNewUser');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// GET Display profile details
router.get('/', isNewUser, profilesController.index);

// GET Display profile details
router.get('/show', isNewUser, ensureLoggedIn, profilesController.show);

// GET Show Edit profile details page
router.get('/edit', ensureLoggedIn, profilesController.edit);

// PUT edit profile details
router.put('/edit', ensureLoggedIn, profilesController.update);

module.exports = router;
