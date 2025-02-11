import mongoose from 'mongoose';

const declarationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
        required: true
    },
    paidAt: {
        type: Date
    },
    movedToHistory: {
        type: Boolean,
        default: false
    }
});

export const Declaration = mongoose.model('Declaration', declarationSchema);