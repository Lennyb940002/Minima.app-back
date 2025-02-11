var express = require('express');
var { AuthService } = require('../services/authService');

var authRouter = express.Router();

authRouter.use(function(req, _res, next) {
  console.log(`Requête Auth : ${req.method} ${req.url}`);
  console.log('En-têtes :', req.headers);
  console.log('Corps de la requête :', req.body);
  next();
});

authRouter.post('/login', function(req, res, next) {
  (async function() {
    try {
      var email = req.body.email;
      var password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({
          error: 'L\'email et le mot de passe sont requis'
        });
      }

      var result = await AuthService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.status(401).json({
        error: error instanceof Error ? error.message : 'Échec de l\'authentification'
      });
    }
  })().catch(next);
});

authRouter.post('/register', function(req, res, next) {
  (async function() {
    try {
      var email = req.body.email;
      var password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({
          error: 'L\'email et le mot de passe sont requis'
        });
      }

      var result = await AuthService.register(email, password);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Échec de l\'inscription'
      });
    }
  })().catch(next);
});

module.exports = { authRouter };

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
