import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    days: [{
        day: {
            type: String,
            required: true
        },
        exercises: [{
            name: {
                type: String,
                required: true
            },
            xp: {
                type: Number,
                required: true
            }
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Program = mongoose.model('Program', programSchema);