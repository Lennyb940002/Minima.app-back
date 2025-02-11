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
