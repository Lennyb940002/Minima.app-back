import { Stock } from '../models/Stock';

export class StockService {
    static async getAll(userId) {
        return await Stock.find({ userId }).sort({ createdAt: -1 });
    }

    static async create(stockData, userId) {
        const stock = new Stock({
            ...stockData,
            userId
        });
        return await stock.save();
    }

    static async update(id, stockData, userId) {
        return await Stock.findOneAndUpdate(
            { _id: id, userId },
            stockData,
            { new: true }
        );
    }

    static async delete(id, userId) {
        return await Stock.findOneAndDelete({ _id: id, userId });
    }

    static async getLowStock(userId) {
        return await Stock.find({
            userId,
            $expr: {
                $lte: ["$quantity", "$threshold"]
            }
        });
    }

    static async getAnalytics(userId) {
        const totalItems = await Stock.countDocuments({ userId });
        const totalValue = await Stock.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$unitPrice"] } } } }
        ]);
        const lowStockItems = await Stock.countDocuments({ userId, $expr: { $lte: ["$quantity", "$threshold"] } });
        return {
            totalItems,
            totalValue: totalValue[0]?.total || 0,
            lowStockItems
        };
    }
}