const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: String,
        googleId: {
            type: String,
        },
        email: String,
        avatar: String,
        isPublic: {
            type: Boolean,
            default: false,
        },
        worksoutsFollowing: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Workout',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
