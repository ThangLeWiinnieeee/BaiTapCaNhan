import express from 'express';
import { getHomePage, getApiHome } from '../controllers/homeController.js';
import { handleRegister, handleLogin, handleGetUser } from '../controllers/userController.js';
import {
  handleGetProducts,
  handleGetCategories,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { delay } from '../middleware/delay.js';
import { apiLimiter, authLimiter, productLimiter } from '../middleware/rateLimiter.js';
import {
  validateRegister,
  validateLogin,
  validateProduct,
  validatePagination,
} from '../middleware/validation.js';
import { requireAdmin, requireUser } from '../middleware/authorization.js';

const router = express.Router();

// Home routes
router.get('/', getHomePage);
router.get('/api', apiLimiter, authenticateToken, getApiHome);

// User routes with validation and rate limiting
router.post(
  '/api/register',
  authLimiter,
  delay(500),
  validateRegister,
  handleRegister
);
router.post(
  '/api/login',
  authLimiter,
  delay(500),
  validateLogin,
  handleLogin
);
router.get(
  '/api/user',
  apiLimiter,
  authenticateToken,
  requireUser,
  handleGetUser
);

// Product routes - Public endpoints (with rate limiting)
router.get('/api/products', apiLimiter, validatePagination, handleGetProducts);
router.get('/api/categories', apiLimiter, handleGetCategories);
router.get('/api/products/:id', apiLimiter, handleGetProductById);

// Product routes - Protected endpoints (require authentication)
router.post(
  '/api/products',
  productLimiter,
  authenticateToken,
  requireAdmin,
  validateProduct,
  handleCreateProduct
);
router.put(
  '/api/products/:id',
  productLimiter,
  authenticateToken,
  requireAdmin,
  validateProduct,
  handleUpdateProduct
);
router.delete(
  '/api/products/:id',
  productLimiter,
  authenticateToken,
  requireAdmin,
  handleDeleteProduct
);

export default router;