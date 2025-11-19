import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const registerUser = async (userData) => {
  try {
    const { email, password, username, phone, address } = userData;

    // Validate required fields
    if (!email || !password || !username) {
      return {
        EC: 1,
        EM: 'Email, password and username are required',
        DT: null,
      };
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        EC: 1,
        EM: 'Email already exists',
        DT: null,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      phone: phone || '',
      address: address || '',
    });

    return {
      EC: 0,
      EM: 'User registered successfully',
      DT: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      EC: -1,
      EM: 'Error registering user',
      DT: null,
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    // Validate input
    if (!email || !password) {
      return {
        EC: 1,
        EM: 'Email and password are required',
        DT: null,
      };
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
        EM: 'Invalid email or password',
        DT: null,
      };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        EC: 1,
        EM: 'Invalid email or password',
        DT: null,
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role || 'user',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    return {
      EC: 0,
      EM: 'Login successful',
      DT: {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          phone: user.phone,
          address: user.address,
          role: user.role || 'user',
        },
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      EC: -1,
      EM: 'Error logging in',
      DT: null,
    };
  }
};

export const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return {
        EC: 1,
        EM: 'User not found',
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: 'Get user info successfully',
      DT: user,
    };
  } catch (error) {
    console.error('Get user info error:', error);
    return {
      EC: -1,
      EM: 'Error getting user info',
      DT: null,
    };
  }
};