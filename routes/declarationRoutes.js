import { Router } from 'express';
import { auth } from '../middleware/auth';
import { DeclarationService } from '../services/declarationService';

export const declarationRouter = Router();

declarationRouter.use(auth);

declarationRouter.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { isPaid } = req.body;

        if (typeof isPaid !== 'boolean') {
            res.status(400).json({
                error: 'isPaid must be a boolean value'
            });
            return;
        }

        if (!/^\d{4}-\d{2}$/.test(id)) {
            res.status(400).json({
                error: 'Invalid declaration ID format. Expected YYYY-MM'
            });
            return;
        }

        const updatedSales = await DeclarationService.updateStatus(id);

        if (!updatedSales) {
            res.status(404).send({ error: 'Sales not found for the given declaration date' });
            return;
        }
        res.status(200).json(updatedSales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});