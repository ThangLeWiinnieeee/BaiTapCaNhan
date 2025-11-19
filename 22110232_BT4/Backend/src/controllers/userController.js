import { registerUser, loginUser, getUserInfo } from '../services/userService.js';

export const handleRegister = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    
    const statusCode = result.EC === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Register controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    
    const statusCode = result.EC === 0 ? 200 : 401;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleGetUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getUserInfo(userId);
    
    const statusCode = result.EC === 0 ? 200 : 404;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Get user controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};