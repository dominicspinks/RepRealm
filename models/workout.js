const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    reps: {
        type: Number,
    },
    time: {
        type: Number,
    },
    weight: {
        type: mongoose.Decimal128,
    },
    distance: {
        type: mongoose.Decimal128,
    },
});

const exerciseDetailSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
    },
    sets: [setSchema],
    rest: {
        type: Number,
        default: 60,
    },
});

const workoutSchema = new Schema(
    {
        name: String,
        exerciseDetails: [exerciseDetailSchema],
        isPublic: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Workout', workoutSchema);
