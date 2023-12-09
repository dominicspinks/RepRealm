const express = require('express');
const router = express.Router();

const profilesController = require('../controllers/profiles');
const isNewUser = require('../config/isNewUser');

// GET Display profile details
router.get('/', isNewUser, profilesController.index);

// GET Display profile details
router.get('/show', isNewUser, profilesController.show);

// GET Show Edit profile details page
router.get('/edit', profilesController.edit);

// PUT edit profile details
router.put('/edit', profilesController.update);

module.exports = router;
