import { Sale, ISale } from '../models/Sale';

export class SaleService {
    static async getAll(userId: string): Promise<ISale[]> {
        return await Sale.find({ userId }).sort({ date: -1 });
    }

    static async create(saleData: any, userId: string): Promise<ISale> {
        try {
            const sale = new Sale({
                userId,
                product: saleData.product,
                quantity: saleData.quantity,
                salePrice: saleData.salePrice,
                unitCost: saleData.unitCost,
                paymentStatus: saleData.paymentStatus,
                date: saleData.date || new Date(),
                margin: (saleData.salePrice - saleData.unitCost) * saleData.quantity,
                decStatus: 1
            });

            const savedSale = await sale.save();
            return savedSale;
        } catch (error) {
            console.error('Error in SaleService.create:', error);
            throw error;
        }
    }

    static async update(id: string, saleData: any, userId: string): Promise<ISale | null> {
        try {
            const updatedData = {
                ...saleData,
                margin: (saleData.salePrice - saleData.unitCost) * saleData.quantity
            };

            const updatedSale = await Sale.findOneAndUpdate(
                { _id: id, userId },
                updatedData,
                { new: true, runValidators: true }
            );

            return updatedSale;
        } catch (error) {
            console.error('Error in SaleService.update:', error);
            throw error;
        }
    }

    static async updateDecStatus(id: string, userId: string): Promise<ISale | null> {
        try {
            const updatedSale = await Sale.findOneAndUpdate(
                { _id: id, userId },
                { decStatus: 2 },
                { new: true }
            );
            return updatedSale;
        } catch (error) {
            console.error('Error in SaleService.updateDecStatus:', error);
            throw error;
        }
    }

    static async delete(id: string, userId: string): Promise<ISale | null> {
        return await Sale.findOneAndDelete({ _id: id, userId });
    }
}