import { Sale } from '../models/Sale';

export class DeclarationService {
    static async updateStatus(id) {
        // Split l'ID en année et mois
        const [year, month] = id.split('-');

        // Crée une requête pour matcher les dates dans le mois/année
        const updatedSales = await Sale.updateMany(
            {
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$date" }, parseInt(year)] },
                        { $eq: [{ $month: "$date" }, parseInt(month)] }
                    ]
                }
            },
            { decStatus: 2 }
        );

        return updatedSales;
    }
}