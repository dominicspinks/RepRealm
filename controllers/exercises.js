const Exercise = require('../models/exercise');
const Category = require('../models/category');
const User = require('../models/user');

module.exports = {
    index,
    new: newExercise,
    show,
    edit,
    create,
    delete: deleteExercise,
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

    // Handle exercise name search filter
    if (
        typeof searchQuery.exerciseName !== 'undefined' &&
        searchQuery.exerciseName?.trim() !== ''
    ) {
        searchFilter['$and'].push({
            name: new RegExp(searchQuery.exerciseName, 'i'),
        });
    }

    // Handle category search filter
    if (
        typeof searchQuery.category !== 'undefined' &&
        searchQuery.category?.trim() !== ''
    ) {
        searchFilter['$and'].push({
            category: searchQuery.category,
        });
    }

    // Get number of search results for pagination
    const exercisesNum = await Exercise.countDocuments(searchFilter);
    const perPage = 10;
    const totalPages = Math.ceil(exercisesNum / perPage);

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

    // Get exercises list
    const exercises = await Exercise.find(searchFilter)
        .sort({ createdAt: 'desc' })
        .limit(perPage)
        .skip(perPage * currentPage)
        .populate({
            path: 'category',
            select: 'name',
        })
        .lean();

    res.render('exercises/index', {
        title: 'Exercises',
        isActive: 'exercises',
        exercises,
        categories,
        pages,
    });
}

// Display page to show the details of an exercise
async function show(req, res) {
    const exercise = await Exercise.findById(req.params.exerciseId).populate({
        path: 'category',
        select: 'name',
    });

    res.render('exercises/show', {
        title: 'Exercise Details',
        isActive: 'exercises-show',
        exercise,
    });
}

// Display page to create a new exercise
async function newExercise(req, res) {
    // get categories for search filter
    const categories = await Category.find({}).sort({ name: 'asc' });

    res.render('exercises/new', {
        title: 'Create New Exercise',
        isActive: 'exercises-new',
        categories,
    });
}

// Add new exercise to the database
async function create(req, res) {
    const reqBody = req.body;
    // validate category
    const categoryId = await Category.findById(reqBody.category);
    if (!categoryId) {
        // invalid category Id supplied, return error
    }
    // validate primary
    const primary = reqBody.primary;
    // validate secondary
    const secondary = reqBody.secondary;

    const newExercise = {
        name: reqBody.name.trim(),
        isPublic: false,
        category: categoryId,
        measurementPrimary: primary,
        createdBy: req.user._id,
    };
    if (secondary !== '') {
        newExercise.measurementSecondary = secondary;
    }

    try {
        const exercise = await Exercise.create(newExercise);
        res.redirect(`/exercises/${exercise._id}`);
    } catch (error) {
        console.log(error);
        res.render('exercises/new', {
            title: 'Create New Exercise',
            isActive: 'exercises-new',
            exercise: newExercise,
        });
    }
}

// Remove an exercise from the database
async function deleteExercise(req, res) {
    const exerciseId = req.params.exerciseId;
    const exercise = await Exercise.findById(exerciseId);
    const userId = await User.findById(req.user._id);

    if (!userId || !userId.equals(exercise.createdBy))
        res.redirect(`/exercises/${exerciseId}`);

    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/exercises`);
}

// Display page to modify exercise details
async function edit(req, res) {
    const exercise = await Exercise.findById(req.params.exerciseId);
    // get categories for search filter
    const categories = await Category.find({}).sort({ name: 'asc' });

    res.render('exercises/edit', {
        title: 'Edit Exercise',
        isActive: 'exercises-edit',
        exercise,
        categories,
    });
}

// Submit modified exercise details to the database
async function update(req, res) {
    const exerciseId = req.params.exerciseId;
    const exercise = await Exercise.findById(exerciseId);

    // verify the exercise is found
    const category = await Category.findById(req.body.category);
    const exerciseName = req.body.name;
    const primary = req.body.primary;
    const secondary = req.body.secondary;

    exercise.category = category;
    exercise.name = exerciseName;
    exercise.measurementPrimary = primary;

    if (secondary === '') {
        delete exercise.measurementSecondary;
    } else {
        exercise.measurementSecondary = secondary;
    }

    await exercise.save();
    res.redirect(`/exercises/${exercise._id}`);
}
