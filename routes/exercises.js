const express = require('express');
const router = express.Router();

const exercisesController = require('../controllers/exercises');

// Index route, display list of Exercises
router.get('/', exercisesController.index);

// New route, display form to create a new exercise
router.get('/new', exercisesController.new);

module.exports = router;
