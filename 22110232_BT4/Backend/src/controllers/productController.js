import {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchAndFilterProducts,
} from '../services/productService.js';

export const handleGetProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;

    const result = await getProducts(page, limit, category);
    const statusCode = result.EC === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Get products controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleGetCategories = async (req, res) => {
  try {
    const result = await getCategories();
    const statusCode = result.EC === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Get categories controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleGetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProductById(id);
    const statusCode = result.EC === 0 ? 200 : result.EC === 1 ? 404 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Get product by ID controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleCreateProduct = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    const statusCode = result.EC === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Create product controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateProduct(id, req.body);
    const statusCode = result.EC === 0 ? 200 : result.EC === 1 ? 404 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Update product controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    const statusCode = result.EC === 0 ? 200 : result.EC === 1 ? 404 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Delete product controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};

export const handleSearchProducts = async (req, res) => {
  try {
    const searchParams = {
      query: req.query.q || req.query.query || '',
      category: req.query.category || null,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      minDiscount: req.query.minDiscount ? parseFloat(req.query.minDiscount) : null,
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : null,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const result = await searchAndFilterProducts(searchParams);
    const statusCode = result.EC === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error('Search products controller error:', error);
    return res.status(500).json({
      EC: -1,
      EM: 'Server error',
      DT: null,
    });
  }
};
