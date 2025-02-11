import dotenv from 'dotenv';

dotenv.config();

export const config = {
    jwtSecret: process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut',
    // autres configurations
};