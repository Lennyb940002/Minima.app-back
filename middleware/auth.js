const { Response, NextFunction } = require('express');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Token missing');
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = {
            userId: user.id,
            email: user.email,
            hasPaid: user.hasPaid,
            role: user.role
        };

        next();
    } catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Authentication error'
        });
    }
};

module.exports = { auth };
