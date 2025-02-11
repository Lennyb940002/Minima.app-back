// app.js

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./db');
const { authRouter } = require('./routes/authRoutes');
const { saleRouter } = require('./routes/saleRoutes');

dotenv.config();

const app = express();

// Configuration de base
app.set('trust proxy', 1);

// Middleware de sécurité
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// Configuration CORS améliorée
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL_AUTH,
            process.env.FRONTEND_URL_LOCAL,
            process.env.FRONTEND_URL_LOCAL_AUTH
        ].filter(Boolean); // Filtre les valeurs null/undefined
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Connexion à la base de données
connectDB().catch(console.error);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);

// Routes
app.use('/api', authRouter);
app.use('/api/sales', saleRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

module.exports = app;
