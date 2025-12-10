import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const registerUser = async (userData) => {
  try {
    const { email, password, username } = userData;

    // Validate required fields
    if (!email || !password || !username) {
      return {
        EC: 1,
        EM: 'Email, password and username are required',
        DT: null,
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        EC: 1,
        EM: 'Invalid email format',
        DT: null,
      };
    }

    // Validate password strength
    if (password.length < 6) {
      return {
        EC: 1,
        EM: 'Password must be at least 6 characters',
        DT: null,
      };
    }

    // Validate username
    if (username.length < 3) {
      return {
        EC: 1,
        EM: 'Username must be at least 3 characters',
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
      fullname: username,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role || 'user',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    return {
      EC: 0,
      EM: 'User registered successfully',
      DT: {
        access_token: token,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullname: newUser.fullname,
          role: newUser.role || 'user',
        },
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
        fullname: user.fullname,
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
          fullname: user.fullname,
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