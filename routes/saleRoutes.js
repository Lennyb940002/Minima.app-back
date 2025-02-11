const express = require('express');
const { auth } = require('../middleware/auth');
const { SaleService } = require('../services/saleService');

const saleRouter = express.Router();

saleRouter.use(auth);

saleRouter.get('/', async (req, res) => {
    try {
        const sales = await SaleService.getAll(req.user.userId);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

saleRouter.post('/', async (req, res) => {
    try {
        const sale = await SaleService.create(req.body, req.user.userId);
        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

saleRouter.put('/:id', async (req, res) => {
    try {
        const sale = await SaleService.update(req.params.id, req.body, req.user.userId);
        if (!sale) {
            res.status(404).json({ error: 'Sale not found' });
            return;
        }
        res.json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

saleRouter.patch('/:id/decstatus', async (req, res) => {
    try {
        const sale = await SaleService.updateDecStatus(req.params.id, req.user.userId);
        if (!sale) {
            res.status(404).json({ error: 'Sale not found' });
            return;
        }
        res.json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

saleRouter.delete('/:id', async (req, res) => {
    try {
        const sale = await SaleService.delete(req.params.id, req.user.userId);
        if (!sale) {
            res.status(404).json({ error: 'Sale not found' });
            return;
        }
        res.json({ message: 'Sale successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { saleRouter };
