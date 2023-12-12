const express = require('express');
const router = express.Router();

const workoutsController = require('../controllers/workouts');
const isNewUser = require('../config/isNewUser');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// Index route, display list of workouts
router.get('/', isNewUser, workoutsController.index);

// New route, display form to create a new workout
router.get('/new', isNewUser, ensureLoggedIn, workoutsController.new);

// POST route to create the new workout
router.post('/new', isNewUser, ensureLoggedIn, workoutsController.create);

// DELETE route to remove a workout
router.delete(
    '/:workoutId',
    isNewUser,
    ensureLoggedIn,
    workoutsController.delete
);

// View route, display details page for selected workout
router.get('/:workoutId', isNewUser, workoutsController.show);

module.exports = router;
