const express = require('express');
const router = express.Router();

const workoutsController = require('../controllers/workouts');
const isNewUser = require('../config/isNewUser');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// Index route, display list of workouts
router.get('/', isNewUser, workoutsController.index);

// New route, display form to create a new workout
router.get('/new', isNewUser, ensureLoggedIn, workoutsController.new);

// View route, display details page for selected workout
router.get('/:workoutId', isNewUser, workoutsController.show);

// Search router
router.get('/search', isNewUser, workoutsController.search);

module.exports = router;
