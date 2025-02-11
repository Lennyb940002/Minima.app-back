// Backend: middleware/auth.js
// Modification critique 3: Améliorer la vérification du token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Token manquant');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        req.user = {
            userId: user._id,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('Erreur auth:', error);
        res.status(401).json({ error: 'Veuillez vous authentifier' });
    }
};
