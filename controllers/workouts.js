const Workout = require('../models/workout');
const Category = require('../models/category');

module.exports = {
    index,
    new: newWorkout,
    search,
    show,
};

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
    console.log(searchFilter);

    // Get workouts list
    const workouts = await Workout.find(searchFilter)
        .populate({
            path: 'createdBy',
            select: 'username -_id',
        })
        .populate({
            path: 'exerciseDetails.exercise',
            select: 'name category',
            populate: {
                path: 'category',
                select: 'name',
            },
        })
        .lean();

    workouts.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
    });
    // console.log(workouts);
    // console.log(workouts[0].exerciseDetails);
    // console.log(workouts[0].exerciseDetails[0].exercise);

    // categories = [
    //     {
    //         name: 'back',
    //         exercises: ['pullups', 'rows'],
    //     },
    // ];

    workouts.forEach((workout) => {
        // Add category to each exercise in each workout
        // Add exercise name to each category in each workout
        workout.categories = [];
        workout.exerciseDetails.forEach((exercise) => {
            const categories = workout.categories.find(
                (category) => (category.name = exercise.exercise.category.name)
            );
            if (categories === undefined) {
                workout.categories.push({
                    name: exercise.exercise.category.name,
                    exercises: [exercise.exercise.name],
                });
            } else {
                categories.exercises.push(exercise.exercise.name);
            }
        });
    });

    console.log(workouts);
    // console.log(workouts[0].exerciseDetails);
    console.log(workouts[0].categories);
    // console.log(workouts[0].exerciseDetails[0].exercise);

    res.render('workouts/index', {
        title: 'Workouts',
        isActive: 'workouts',
        workouts,
        categories,
    });
}

// Page to create new workout
function newWorkout(req, res) {
    res.render('workouts/new', {
        title: 'Create Workout',
        isActive: 'workouts-new',
    });
}

// Process search filters on workouts list page
function search(req, res) {
    // Process each value to avoid errors with url
    const workout = req.body.workoutName;
    const category = req.body.category;
    const user = req.body.username;

    res.redirect(
        `/workouts?workout=${workout}&category=${category}&user=${user}`
    );
}

async function show(req, res) {
    const workout = await Workout.findById(req.params.workoutId);

    res.render('workouts/show', {
        title: workout.name,
        isActive: 'workouts-show',
        workout,
    });
}
