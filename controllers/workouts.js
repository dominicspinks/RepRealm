const Workout = require('../models/workout');
const Category = require('../models/category');
const Exercise = require('../models/exercise');
const User = require('../models/user');

module.exports = {
    index,
    new: newWorkout,
    search,
    show,
    create,
    delete: deleteWorkout,
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
    // console.log(searchFilter);

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

    // Add exercise name to each category in each workout
    workouts.forEach((workout) => {
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

    res.render('workouts/index', {
        title: 'Workouts',
        isActive: 'workouts',
        workouts,
        categories,
    });
}

// Page to create new workout
async function newWorkout(req, res) {
    // get categories for add exercise
    const categories = await Category.find({}).lean();
    categories.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
    });

    // Get all exercises
    const exercises = await Exercise.find({});
    // console.log(exercises);
    // get exercises for each category
    categories.forEach((category) => {
        category.exercises = '';
    });

    res.render('workouts/new', {
        title: 'Create Workout',
        isActive: 'workouts-new',
        categories,
        exercises,
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
    const workout = await Workout.findById(req.params.workoutId)
        .populate({
            path: 'createdBy',
            select: 'username',
        })
        .populate({
            path: 'exerciseDetails.exercise',
            select: 'name category measurementPrimary measurementSecondary',
            populate: {
                path: 'category',
                select: 'name',
            },
        });
    console.log(workout);
    res.render('workouts/show', {
        title: workout.name,
        subtitle: `Created by ${workout.createdBy.username}`,
        isActive: 'workouts-show',
        workout,
    });
}

async function create(req, res) {
    const reqBody = req.body;

    const newWorkout = {
        name: reqBody.name.trim(),
        isPublic: reqBody.isPublic === 'on' ? true : false,
        exerciseDetails: [],
        createdBy: req.user._id,
    };

    Object.keys(reqBody).forEach((key) => {
        if (!key.match(/^exerciseDetails\d+$/i)) return;

        const exerciseDetail = JSON.parse(reqBody[key]);
        newWorkout.exerciseDetails.push(exerciseDetail);
    });
    try {
        const workout = await Workout.create(newWorkout);
        res.redirect(`/workouts/${workout._id}`);
    } catch (error) {
        console.log(error);
        res.render('workouts/new');
    }
}

async function deleteWorkout(req, res) {
    const workoutId = req.params.workoutId;
    const workout = await Workout.findById(workoutId);
    const userId = await User.findById(req.user._id);

    if (!userId || !userId.equals(workout.createdBy))
        res.redirect(`/workouts/${workoutId}`);

    await Workout.findByIdAndDelete(workoutId);
    res.redirect(`/workouts`);
}
