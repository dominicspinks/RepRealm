const express = require('express');
const router = express.Router();

const exercisesController = require('../controllers/exercises');
const isNewUser = require('../config/isNewUser');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// Index route, display list of Exercises
router.get('/', isNewUser, exercisesController.index);

// New route, display form to create a new exercise
router.get('/new', isNewUser, ensureLoggedIn, exercisesController.new);

// POST Submit new exercise
router.post('/', isNewUser, ensureLoggedIn, exercisesController.create);

// DELETE route to remove a exercise
router.delete(
    '/:exerciseId',
    isNewUser,
    ensureLoggedIn,
    exercisesController.delete
);

// Display exercise details
router.get('/:exerciseId', isNewUser, exercisesController.show);

// Display edit exercise page
router.get(
    '/:exerciseId/edit',
    isNewUser,
    ensureLoggedIn,
    exercisesController.edit
);

// PUT route to modify an exercise
router.put('/:exerciseId', isNewUser, exercisesController.update);

module.exports = router;
