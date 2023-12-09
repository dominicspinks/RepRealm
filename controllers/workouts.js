const Workout = require('../models/workout');

module.exports = {
    index,
    new: newWorkout,
};

// Page to display list of workouts
function index(req, res) {
    res.render('workouts/index', {
        title: 'Workouts',
        isActive: 'workouts',
    });
}

// Page to create new workout
function newWorkout(req, res) {
    res.render('workouts/new', {
        title: 'Create Workout',
        isActive: 'workouts-new',
    });
}
