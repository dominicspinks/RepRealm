require('dotenv').config();
require('./config/database');

const Category = require('./models/category');
const Exercise = require('./models/exercise');
const Workout = require('./models/workout');
const User = require('./models/user');

(async function () {
    // Clean collections
    const d1 = Category.deleteMany({});
    const d2 = Exercise.deleteMany({});
    const d3 = Workout.deleteMany({});

    let results = await Promise.all([d1, d2, d3]);
    console.log(results);

    // Remove all users
    results = await User.deleteMany({});
    console.log(results);

    // Remove admin user (if recreating)
    // results = await User.deleteOne({ username: 'admin' });
    // console.log(results);

    // Create admin user (for default exercises)
    const dataUser = [
        {
            username: 'admin',
            isNew: false,
        },
    ];

    createdUsers = await User.create(dataUser);
    console.log('Users created:', createdUsers);

    const adminUser = await User.findOne({ username: 'admin' });

    // Import Categories
    const dataCategories = [
        { name: 'Abs' },
        { name: 'Back' },
        { name: 'Biceps' },
        { name: 'Cardio' },
        { name: 'Chest' },
        { name: 'Forearms' },
        { name: 'Legs' },
        { name: 'Shoulders' },
        { name: 'Triceps' },
    ];

    createdCategories = await Category.create(dataCategories);
    // console.log('Categories created:', createdCategories);

    // Import exercises
    const dataExercise = [
        {
            name: 'Crunch',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'TIME',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Figure 8',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'TIME',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Barbell Row',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Chin Up',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'WEIGHT',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Running (Outdoor)',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Elliptical Trainer',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'TIME',
            measurementSecondary: 'DISTANCE',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Pushups',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'WEIGHT',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Bench Press',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dead Hang',
            category: createdCategories.find(
                (category) => category.name === 'Forearms'
            )._id,
            measurementPrimary: 'TIME',
            measurementSecondary: 'WEIGHT',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Forearm Curl',
            category: createdCategories.find(
                (category) => category.name === 'Forearms'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Barbell Squat',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Lunge',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Overhead Press',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Side-Lateral Raise',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Cable Pushdown',
            category: createdCategories.find(
                (category) => category.name === 'Triceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Lying Triceps Extension',
            category: createdCategories.find(
                (category) => category.name === 'Triceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Barbell Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Concentration Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
    ];

    createdExercises = await Exercise.create(dataExercise);
    // console.log('Exercises created:', createdExercises);

    // Import Workouts
    const dataWorkouts = [
        {
            name: 'Sample Workout 1',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Barbell Row'
                    )._id,
                    sets: [
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Pushups'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
            ],
            createdBy: adminUser._id,
        },
        {
            name: 'Sample Workout 2',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Barbell Row'
                    )._id,
                    sets: [
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Pushups'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
            ],
            createdBy: adminUser._id,
        },
        {
            name: 'Sample Workout 3',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Barbell Row'
                    )._id,
                    sets: [
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Pushups'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
            ],
            createdBy: adminUser._id,
        },
        {
            name: 'Sample Workout 4',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Barbell Row'
                    )._id,
                    sets: [
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Pushups'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
            ],
            createdBy: adminUser._id,
        },
        {
            name: 'Sample Workout 5',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Barbell Row'
                    )._id,
                    sets: [
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                        {
                            weight: 50,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Pushups'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                        {
                            weight: 0,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
            ],
            createdBy: adminUser._id,
        },
    ];

    createdWorkouts = await Workout.create(dataWorkouts);
    // console.log('Workouts created:', createdWorkouts);

    process.exit();
})();
