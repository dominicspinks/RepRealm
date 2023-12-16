const Workout = require('../models/workout');
const Category = require('../models/category');
const Exercise = require('../models/exercise');
const User = require('../models/user');

module.exports = {
    index,
    new: newWorkout,
    show,
    create,
    delete: deleteWorkout,
    edit,
    update,
};

// Page to display list of workouts
async function index(req, res) {
    const searchQuery = req.query;

    // get categories for search filter
    const categories = await Category.find({}).sort({ name: 'asc' });

    // Set workout search filter
    const searchFilter = { $and: [] };
    if (req.user) {
        searchFilter['$and'].push({
            $or: [{ isPublic: true }, { createdBy: req.user._id }],
        });
    } else {
        searchFilter['$and'].push({
            isPublic: true,
        });
    }

    // Handle workout name search filter
    if (
        typeof searchQuery.workoutName !== 'undefined' &&
        searchQuery.workoutName?.trim() !== ''
    ) {
        searchFilter['$and'].push({
            name: new RegExp(searchQuery.workoutName, 'i'),
        });
    }

    // Handle category search filter
    if (
        typeof searchQuery.category !== 'undefined' &&
        searchQuery.category?.trim() !== ''
    ) {
        // Get list of exercises for the selected category
        const searchExercises = Array.from(
            await Exercise.find({
                category: searchQuery.category,
            }).select('_id')
        ).map((object) => object._id);

        if (searchExercises.length !== 0) {
            searchFilter['$and'].push({
                'exerciseDetails.exercise': searchExercises[0],
            });
        }
    }

    // Get number of search results for pagination
    const workoutsNum = await Workout.countDocuments(searchFilter);
    const perPage = 10;
    const totalPages = Math.ceil(workoutsNum / perPage);

    let currentPage = 0;
    if (
        typeof searchQuery.page !== 'undefined' &&
        Math.abs(parseInt(searchQuery.page)) !== NaN
    ) {
        currentPage = Math.abs(parseInt(searchQuery.page));
    }
    delete searchQuery.page;

    const pages = {
        currentPage,
        totalPages,
        searchRedirect: new URLSearchParams(searchQuery).toString(),
    };

    // Get workouts list
    const workouts = await Workout.find(searchFilter)
        .sort({ createdAt: 'desc' })
        .limit(perPage)
        .skip(perPage * currentPage)
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

    // Add exercise name to each category in each workout
    workouts.forEach((workout) => {
        workout.categories = [];
        workout.exerciseDetails.forEach((exercise) => {
            const categories = workout.categories.find(
                (category) => category.name === exercise.exercise.category.name
            );
            if (typeof categories === 'undefined') {
                workout.categories.push({
                    name: exercise.exercise.category.name,
                    exercises: [exercise.exercise.name],
                });
            } else if (
                typeof categories.exercises.find(
                    (value) => value === exercise.exercise.name
                ) === 'undefined'
            ) {
                categories.exercises.push(exercise.exercise.name);
            }
        });
    });

    res.render('workouts/index', {
        title: 'Workouts',
        isActive: 'workouts',
        workouts,
        categories,
        pages,
    });
}

// Page to create new workout
async function newWorkout(req, res) {
    // get categories for add exercise
    const categories = await Category.find({}).sort({ name: 'asc' }).lean();

    // Get all exercises that are public or belong to the current user
    const exercises = await Exercise.find({
        $or: [{ isPublic: true }, { createdBy: req.user._id }],
    }).sort({ name: 'asc' });

    // get exercises for each category
    categories.forEach((category) => {
        category.exercises = Array.from(exercises)
            .filter(
                (exercise) =>
                    exercise.category.toString() === category._id.toString()
            )
            .map((exercise) => exercise.name)
            .join('||');
    });

    res.render('workouts/new', {
        title: 'Create Workout',
        isActive: 'workouts-new',
        categories,
        exercises,
    });
}

// Page to show the details of a workout
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

    res.render('workouts/show', {
        title: workout.name,
        subtitle: `Created by ${workout.createdBy.username}`,
        isActive: 'workouts-show',
        workout,
    });
}

// Add a new workout to the database
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
        res.redirect('/workouts/new');
    }
}

// Remove a workout from the database
async function deleteWorkout(req, res) {
    const workoutId = req.params.workoutId;
    const workout = await Workout.findById(workoutId);
    const userId = await User.findById(req.user._id);

    if (!userId || !userId.equals(workout.createdBy))
        res.redirect(`/workouts/${workoutId}`);

    await Workout.findByIdAndDelete(workoutId);
    res.redirect(`/workouts`);
}

// Display page to modify workout details
async function edit(req, res) {
    const workout = await Workout.findById(req.params.workoutId)
        .populate({
            path: 'exerciseDetails.exercise',
            select: 'name',
        })
        .lean();

    // get categories for search filter
    const categories = await Category.find({}).sort({ name: 'asc' });

    // Get all exercises that are public or belong to the current user
    const exercises = await Exercise.find({
        $or: [{ isPublic: true }, { createdBy: req.user._id }],
    });

    // get exercises for each category
    categories.forEach((category) => {
        category.exercises = Array.from(exercises)
            .filter(
                (exercise) =>
                    exercise.category.toString() === category._id.toString()
            )
            .map((exercise) => exercise.name)
            .join('||');
    });

    // // create exerciseDetails value to be used on the page
    const exerciseDetailsValue = [];
    workout.exerciseDetails.forEach((exercise) => {
        const exerciseDetail = {
            exercise: exercise.exercise._id.toString(),
            exerciseName: exercise.exercise?.name,
            rest: exercise.rest.toString(),
            sets: [],
        };
        exercise.sets.forEach((set) => {
            const setValue = {};
            Object.keys(set).forEach((key) => {
                if (key !== '_id') setValue[key] = set[key].toString();
            });

            exerciseDetail.sets.push(setValue);
        });
        exerciseDetailsValue.push(exerciseDetail);
    });
    workout.exerciseDetails = exerciseDetailsValue;

    res.render('workouts/edit', {
        title: 'Edit Workout',
        isActive: 'workouts-edit',
        workout,
        categories,
        exercises,
    });
}

// Submit modified workout details to the database
async function update(req, res) {
    const workoutId = req.params.workoutId;
    const updatedWorkout = req.body;
    const workout = await Workout.findById(workoutId);

    // verify the workout is found
    const category = await Category.findById(req.body.category);

    workout.name = updatedWorkout.name.trim();
    workout.isPublic = updatedWorkout.isPublic === 'on';
    workout.rest = +updatedWorkout.restInput;
    workout.exerciseDetails = [];

    Object.keys(updatedWorkout).forEach((key) => {
        if (!key.match(/^exerciseDetails\d+$/i)) return;

        const exerciseDetail = JSON.parse(updatedWorkout[key]);
        workout.exerciseDetails.push(exerciseDetail);
    });

    try {
        await workout.save();
        res.redirect(`/workouts/${workout._id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/workouts/${workout._id}/edit');
    }
}
