const Exercise = require('../models/exercise');
const Category = require('../models/category');

module.exports = {
    index,
    new: newExercise,
    show,
};

// Page to create new workout
function newExercise(req, res) {
    res.render('exercises/new', {
        title: 'Create Exercise',
        isActive: 'exercises-new',
    });
}

// Page to display list of workouts
async function index(req, res) {
    // get categories for search filter
    const categories = await Category.find({});
    categories.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
    });

    // Set workout search filter
    const searchFilter = {};
    if (req.user) {
        searchFilter['$or'] = [{ isPublic: true }, { createdBy: req.user._id }];
    } else {
        searchFilter['isPublic'] = true;
    }

    // Get exercises list
    const exercises = await Exercise.find(searchFilter)
        .populate({
            path: 'category',
            select: 'name',
        })
        .lean();

    exercises.sort((a, b) => {
        return a.name > b.name ? -1 : 1;
    });

    res.render('exercises/index', {
        title: 'Exercises',
        isActive: 'exercises',
        exercises,
        categories,
    });
}

async function show(req, res) {
    const exercise = await Exercise.findById(req.params.exerciseId).populate({
        path: 'category',
        select: 'name',
    });
    console.log(exercise);
    res.render('exercises/show', {
        title: 'Exercise Details',
        isActive: 'exercises-show',
        exercise,
    });
}
