const express = require('express');
const router = express.Router();

const exercisesController = require('../controllers/exercises');
const isNewUser = require('../config/isNewUser');

// Index route, display list of Exercises
router.get('/', isNewUser, exercisesController.index);

// New route, display form to create a new exercise
router.get('/new', isNewUser, exercisesController.new);

module.exports = router;
