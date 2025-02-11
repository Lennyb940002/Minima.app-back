// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./db');
const { authRouter } = require('./routes/authRoutes');
const { saleRouter } = require('./routes/saleRoutes');
require('dotenv').config();

/**
 * Configuration et initialisation de l'application Express
 */
const app = express();

// Configuration de sécurité de base
app.set('trust proxy', 1);
app.use(helmet());

// Configuration du rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false
});

// Appliquer le rate limiting à toutes les requêtes
app.use(limiter);

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('combined'));
}

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuration CORS détaillée
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://minimaapp2-front.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origine bloquée par CORS:', origin);
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 600 // Cache CORS pour 10 minutes
};

app.use(cors(corsOptions));

// Connexion à la base de données
connectDB().catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);
});

// Routes de l'API
app.use('/api', authRouter);
app.use('/api/sales', saleRouter);

// Route de test pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    
    // Ne pas exposer les détails de l'erreur en production
    const error = process.env.NODE_ENV === 'development' 
        ? { message: err.message, stack: err.stack }
        : { message: 'Une erreur est survenue' };

    res.status(err.status || 500).json({ error });
});

module.exports = app;
