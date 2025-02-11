import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    unitCost: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['En attente', 'Effectué', 'Annulé']
    },
    date: {
        type: Date,
        default: Date.now
    },
    margin: {
        type: Number,
        required: true
    },
    decStatus: {
        type: Number,
        required: true,
        default: 1
    }
});

saleSchema.pre('save', function (next) {
    if (this.decStatus === undefined) {
        this.decStatus = 1;
    }
    next();
});

export const Sale = mongoose.model('Sale', saleSchema);