var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var { connectDB } = require('./db');
var { authRouter } = require('./routes/authRoutes');
// Ajout de l'import du saleRouter
var { saleRouter } = require('./routes/saleRoutes');

dotenv.config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_AUTH, process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL_LOCAL_AUTH],
  credentials: true,
  exposedHeaders: ["set-cookie"],
}));
app.use(helmet());
app.use(bodyParser.json());

connectDB();

var limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Changement des routes
app.use('/api', authRouter);
app.use('/api/sales', saleRouter); // Ajout de la route des ventes

module.exports = app;
