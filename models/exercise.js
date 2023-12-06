const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        measurementPrimary: {
            type: String,
            enum: ['REPS', 'WEIGHT', 'DISTANCE', 'TIME'],
            // required: true,
        },
        measurementSecondary: {
            type: String,
            enum: ['REPS', 'WEIGHT', 'DISTANCE', 'TIME'],
        },
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

module.exports = mongoose.model('Exercise', exerciseSchema);
