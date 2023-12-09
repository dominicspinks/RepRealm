const express = require('express');
const router = express.Router();

const workoutsController = require('../controllers/workouts');

// Index route, display list of workouts
router.get('/', workoutsController.index);

// New route, display form to create a new workout
router.get('/new', workoutsController.new);

module.exports = router;
