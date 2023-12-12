const express = require('express');
const router = express.Router();

const exercisesController = require('../controllers/exercises');
const isNewUser = require('../config/isNewUser');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// Index route, display list of Exercises
router.get('/', isNewUser, exercisesController.index);

// New route, display form to create a new exercise
router.get('/new', isNewUser, ensureLoggedIn, exercisesController.new);

// Display exercise details
router.get('/:exerciseId', isNewUser, exercisesController.show);

module.exports = router;
