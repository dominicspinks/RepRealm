const express = require('express');
const router = express.Router();

const profilesController = require('../controllers/profiles');

// Display profile details
router.get('/', profilesController.index);

// Display profile details
router.get('/show', profilesController.show);

// Edit profile details
router.get('/edit', profilesController.edit);

module.exports = router;
