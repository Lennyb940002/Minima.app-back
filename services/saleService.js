import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class AuthService {
  static TOKEN_EXPIRATION = '24h';

  static createToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        hasPaid: user.hasPaid
      },
      config.jwtSecret,
      { expiresIn: AuthService.TOKEN_EXPIRATION }
    );
  }

  static formatUserResponse(user) {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hasPaid: user.hasPaid
      },
      token: AuthService.createToken(user)
    };
  }

  static async register(email, password) {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = new User({ email, password });
    await user.save();
    return AuthService.formatUserResponse(user);
  }

  static async login(email, password) {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return AuthService.formatUserResponse(user);
  }
}

export { AuthService };


const { Sale } = require('../models/Sale');

class SaleService {
    static async getAll(userId) {
        return await Sale.find({ userId }).sort({ date: -1 });
    }

    static async create(saleData, userId) {
        try {
            const sale = new Sale({
                userId,
                product: saleData.product,
                quantity: saleData.quantity,
                salePrice: saleData.salePrice,
                unitCost: saleData.unitCost,
                paymentStatus: saleData.paymentStatus,
                date: saleData.date || new Date(),
                margin: (saleData.salePrice - saleData.unitCost) * saleData.quantity,
                decStatus: 1
            });

            const savedSale = await sale.save();
            return savedSale;
        } catch (error) {
            console.error('Error in SaleService.create:', error);
            throw error;
        }
    }

    static async update(id, saleData, userId) {
        try {
            const updatedData = {
                ...saleData,
                margin: (saleData.salePrice - saleData.unitCost) * saleData.quantity
            };

            const updatedSale = await Sale.findOneAndUpdate(
                { _id: id, userId },
                updatedData,
                { new: true, runValidators: true }
            );

            return updatedSale;
        } catch (error) {
            console.error('Error in SaleService.update:', error);
            throw error;
        }
    }

    static async updateDecStatus(id, userId) {
        try {
            const updatedSale = await Sale.findOneAndUpdate(
                { _id: id, userId },
                { decStatus: 2 },
                { new: true }
            );
            return updatedSale;
        } catch (error) {
            console.error('Error in SaleService.updateDecStatus:', error);
            throw error;
        }
    }

    static async delete(id, userId) {
        return await Sale.findOneAndDelete({ _id: id, userId });
    }
}

module.exports = { SaleService };
