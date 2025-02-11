// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

/**
 * Middleware d'authentification pour vérifier le JWT token
 */
const auth = async (req, res, next) => {
    try {
        // Récupération du token depuis le header Authorization
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            console.log('Header Authorization manquant');
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        if (!token) {
            console.log('Token non trouvé dans le header');
            return res.status(401).json({ error: 'Token manquant' });
        }

        try {
            // Vérification du token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Recherche de l'utilisateur
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                console.log('Utilisateur non trouvé avec le token');
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }

            // Ajout des informations utilisateur à la requête
            req.user = {
                userId: user._id,
                email: user.email,
                role: user.role,
                hasPaid: user.hasPaid
            };

            next();
        } catch (jwtError) {
            console.log('Erreur de vérification du token:', jwtError);
            return res.status(401).json({ error: 'Token invalide' });
        }
    } catch (error) {
        console.error('Erreur dans le middleware auth:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
    }
};

module.exports = { auth };
