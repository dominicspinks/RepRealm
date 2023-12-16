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
    // results = await User.deleteOne({ username: 'demo' });
    // console.log(results);

    // Create admin user (for default exercises)
    const dataUser = [
        {
            username: 'demo',
            isNewUser: false,
        },
    ];

    createdUsers = await User.create(dataUser);
    console.log('Users created:', createdUsers);

    const adminUser = await User.findOne({ username: 'demo' });

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
        {
            name: 'Ab-Wheel Rollout',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Cable Crunch',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Decline Crunch',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Elbow To Knee',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Hanging Knee Raise',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Hanging Leg Raise',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Plank',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'TIME',
            measurementSecondary: null,
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Power Ups',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Seated High Twist',
            category: createdCategories.find(
                (category) => category.name === 'Abs'
            )._id,
            measurementPrimary: 'REPS',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Barbell Shrug',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Deadlift',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Row',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Lat Pulldown',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Pull Up',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Seated Cable Row',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Straight-Arm Cable Pushdown',
            category: createdCategories.find(
                (category) => category.name === 'Back'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Cable Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Hammer Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Preacher Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'EZ-Bar Curl',
            category: createdCategories.find(
                (category) => category.name === 'Biceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Running (Treadmill)',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Swimming',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Cycling',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Staionary Bike',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Walking',
            category: createdCategories.find(
                (category) => category.name === 'Cardio'
            )._id,
            measurementPrimary: 'DISTANCE',
            measurementSecondary: 'TIME',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Cable Cross-Over',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Decline Barbell Press',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dips',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Fly',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Incline Dumbbell Press',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Pushups (Clapping)',
            category: createdCategories.find(
                (category) => category.name === 'Chest'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Split Squat',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Front Squat',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Glute Bridge',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Clean',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Goblet Squat',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Calf Raise',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Single-leg Deadlift',
            category: createdCategories.find(
                (category) => category.name === 'Legs'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Bradford Press',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Alternating Dumbbell Shoulder Press',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Face Pulls',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Front Dumbbell Raise',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Rear Delt Dumbbell Raise',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Push Press',
            category: createdCategories.find(
                (category) => category.name === 'Shoulders'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Close Grip Pin Press',
            category: createdCategories.find(
                (category) => category.name === 'Triceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'Dumbbell Overhead Triceps Extension',
            category: createdCategories.find(
                (category) => category.name === 'Triceps'
            )._id,
            measurementPrimary: 'WEIGHT',
            measurementSecondary: 'REPS',
            isPublic: true,
            createdBy: adminUser._id,
        },
        {
            name: 'JM Press',
            category: createdCategories.find(
                (category) => category.name === 'Triceps'
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
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Bench Press'
                    )._id,
                    sets: [
                        {
                            weight: 30,
                            reps: 15,
                        },
                        {
                            weight: 30,
                            reps: 15,
                        },
                        {
                            weight: 30,
                            reps: 15,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Chin Up'
                    )._id,
                    sets: [
                        {
                            weight: 0,
                            reps: 5,
                        },
                        {
                            weight: 0,
                            reps: 5,
                        },
                        {
                            weight: 0,
                            reps: 5,
                        },
                        {
                            weight: 0,
                            reps: 5,
                        },
                        {
                            weight: 0,
                            reps: 5,
                        },
                    ],
                    rest: 120,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Bench Press'
                    )._id,
                    sets: [
                        {
                            weight: 30,
                            reps: 15,
                        },
                        {
                            weight: 30,
                            reps: 15,
                        },
                        {
                            weight: 30,
                            reps: 15,
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
                        (exercise) => exercise.name === 'Barbell Squat'
                    )._id,
                    sets: [
                        {
                            weight: 100,
                            reps: 5,
                        },
                        {
                            weight: 100,
                            reps: 5,
                        },
                        {
                            weight: 100,
                            reps: 5,
                        },
                        {
                            weight: 100,
                            reps: 5,
                        },
                        {
                            weight: 100,
                            reps: 5,
                        },
                    ],
                    rest: 120,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Dumbbell Lunge'
                    )._id,
                    sets: [
                        {
                            weight: 20,
                            reps: 10,
                        },
                        {
                            weight: 20,
                            reps: 10,
                        },
                        {
                            weight: 20,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Glute Bridge'
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
            ],
            createdBy: adminUser._id,
        },
        {
            name: 'Sample Workout 3',
            isPublic: true,
            exerciseDetails: [
                {
                    exercise: createdExercises.find(
                        (exercise) =>
                            exercise.name === 'Dumbbell Concentration Curl'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 12,
                        },
                        {
                            weight: 10,
                            reps: 12,
                        },
                        {
                            weight: 10,
                            reps: 12,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Close Grip Pin Press'
                    )._id,
                    sets: [
                        {
                            weight: 30,
                            reps: 10,
                        },
                        {
                            weight: 30,
                            reps: 10,
                        },
                    ],
                    rest: 90,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Dumbbell Hammer Curl'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 10,
                        },
                        {
                            weight: 10,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) => exercise.name === 'Cable Pushdown'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 20,
                        },
                        {
                            weight: 10,
                            reps: 20,
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
                        (exercise) => exercise.name === 'Overhead Press'
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
                        (exercise) => exercise.name === 'Front Dumbbell Raise'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 10,
                        },
                        {
                            weight: 10,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) =>
                            exercise.name === 'Dumbbell Side-Lateral Raise'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 10,
                        },
                        {
                            weight: 10,
                            reps: 10,
                        },
                    ],
                    rest: 60,
                },
                {
                    exercise: createdExercises.find(
                        (exercise) =>
                            exercise.name === 'Rear Delt Dumbbell Raise'
                    )._id,
                    sets: [
                        {
                            weight: 10,
                            reps: 10,
                        },
                        {
                            weight: 10,
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
                        (exercise) => exercise.name === 'Running (Outdoor)'
                    )._id,
                    sets: [
                        {
                            distance: 5000,
                            time: 0,
                        },
                    ],
                    rest: 90,
                },
            ],
            createdBy: adminUser._id,
        },
    ];

    createdWorkouts = await Workout.create(dataWorkouts);
    // console.log('Workouts created:', createdWorkouts);

    process.exit();
})();
