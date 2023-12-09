const Workout = require('../models/exercise');

module.exports = {
    index,
    new: newExercise,
};

// Page to display list of workouts
function index(req, res) {
    res.render('exercises/index', {
        title: 'Exercises',
        isActive: 'exercises'
    });
}

// Page to create new workout
function newExercise(req, res) {
    res.render('exercises/new', {
        title: 'Create Exercise',
        isActive: 'exercises-new',
    });
}
