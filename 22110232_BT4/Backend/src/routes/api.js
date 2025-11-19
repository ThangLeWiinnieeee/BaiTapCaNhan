import express from 'express';
import { getHomePage, getApiHome } from '../controllers/homeController.js';
import { handleRegister, handleLogin, handleGetUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { delay } from '../middleware/delay.js';

const router = express.Router();

// Home routes
router.get('/', getHomePage);
router.get('/api', authenticateToken, getApiHome);

// User routes
router.post('/api/register', delay(500), handleRegister);
router.post('/api/login', delay(500), handleLogin);
router.get('/api/user', authenticateToken, handleGetUser);

export default router;