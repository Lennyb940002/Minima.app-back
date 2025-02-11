import mongoose from 'mongoose';

const marketingCampaignSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    script: {
        type: String
    },
    hashtags: {
        type: String,
        required: true
    },
    isAd: {
        type: Boolean,
        required: true
    },
    adBudget: {
        type: Number
    },
    adDuration: {
        type: String
    },
    postDate: {
        type: String
    },
    postTime: {
        type: String
    },
    platform: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    objective: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'marketing'
});

export const MarketingCampaign = mongoose.model('MarketingCampaign', marketingCampaignSchema);