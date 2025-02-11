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

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Configuration de base
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(bodyParser.json());

// Configuration CORS avancée
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_AUTH,
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_LOCAL_AUTH
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
});
app.use(limiter);

// Connexion à la base de données
connectDB().catch(console.error);

// Configuration des routes
app.use('/api/auth', authRouter); // Préfixer les routes d'auth avec /auth
app.use('/api/sales', saleRouter); // Routes pour les ventes

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
