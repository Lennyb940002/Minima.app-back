import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    costPrice: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['draft', 'in-progress', 'validated', 'rejected'],
        default: 'draft'
    },
    totalScore: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    link: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    margin: {
        type: Number,
        default: 0,
        min: 0
    },
    effect: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    problem: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    images: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    videos: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    competition: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    season: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    }
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);