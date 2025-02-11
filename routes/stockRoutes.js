import { Router } from 'express';
import { auth } from '../middleware/auth';
import { StockService } from '../services/stockService';

const stockRouter = Router();

// Middleware d'authentification
stockRouter.use(auth);

// Récupérer tous les stocks
stockRouter.get('/', async (req, res) => {
    try {
        const stocks = await StockService.getAll(req.user.userId);
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Créer un nouveau stock
stockRouter.post('/', async (req, res) => {
    try {
        const { name, reference, category, quantity, minQuantity, unitPrice, salePrice, threshold, price, description } = req.body;
        if (!name || !reference || !category || typeof quantity !== 'number' || typeof minQuantity !== 'number' || typeof unitPrice !== 'number' || typeof salePrice !== 'number' || typeof threshold !== 'number') {
            res.status(400).json({ error: 'Invalid data' });
            return;
        }
        const stock = await StockService.create({ name, reference, category, quantity, minQuantity, unitPrice, salePrice, threshold, price, description }, req.user.userId);
        res.status(201).json(stock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mettre à jour un stock existant
stockRouter.put('/:id', async (req, res) => {
    try {
        const { name, reference, category, quantity, minQuantity, unitPrice, salePrice, threshold, price, description } = req.body;
        if (!name || !reference || !category || typeof quantity !== 'number' || typeof minQuantity !== 'number' || typeof unitPrice !== 'number' || typeof salePrice !== 'number' || typeof threshold !== 'number') {
            res.status(400).json({ error: 'Invalid data' });
            return;
        }
        const stock = await StockService.update(req.params.id, { name, reference, category, quantity, minQuantity, unitPrice, salePrice, threshold, price, description }, req.user.userId);
        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.json(stock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un stock
stockRouter.delete('/:id', async (req, res) => {
    try {
        const stock = await StockService.delete(req.params.id, req.user.userId);
        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.json({ message: 'Stock successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer les stocks faibles
stockRouter.get('/low-stock', async (req, res) => {
    try {
        const lowStock = await StockService.getLowStock(req.user.userId);
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer les données analytiques
stockRouter.get('/analytics', async (req, res) => {
    try {
        const analytics = await StockService.getAnalytics(req.user.userId);
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { stockRouter };