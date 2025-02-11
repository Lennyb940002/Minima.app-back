import { MarketingCampaign } from '../models/MarketingCampaign';

export class MarketingService {
    static async getAll(userId) {
        return await MarketingCampaign.find({ userId }).sort({ postDate: -1 });
    }

    static async create(campaignData, userId) {
        try {
            const campaign = new MarketingCampaign({
                userId,
                ...campaignData
            });

            return await campaign.save();
        } catch (error) {
            console.error('Error in MarketingService.create:', error);
            throw error;
        }
    }

    static async update(id, campaignData, userId) {
        try {
            return await MarketingCampaign.findOneAndUpdate(
                { _id: id, userId },
                campaignData,
                { new: true }
            );
        } catch (error) {
            console.error('Error in MarketingService.update:', error);
            throw error;
        }
    }

    static async delete(id, userId) {
        return await MarketingCampaign.findOneAndDelete({ _id: id, userId });
    }
}