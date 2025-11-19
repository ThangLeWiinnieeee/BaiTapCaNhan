import Product from '../models/product.js';

// Get all products with pagination and optional category filter
export const getProducts = async (page = 1, limit = 10, category = null) => {
  try {
    const skip = (page - 1) * limit;
    const query = { status: 'active' };
    
    if (category) {
      query.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      EC: 0,
      EM: 'Get products successfully',
      DT: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error('Get products error:', error);
    return {
      EC: -1,
      EM: 'Error getting products',
      DT: null,
    };
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    
    return {
      EC: 0,
      EM: 'Get categories successfully',
      DT: categories,
    };
  } catch (error) {
    console.error('Get categories error:', error);
    return {
      EC: -1,
      EM: 'Error getting categories',
      DT: null,
    };
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return {
        EC: 1,
        EM: 'Product not found',
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: 'Get product successfully',
      DT: product,
    };
  } catch (error) {
    console.error('Get product by ID error:', error);
    return {
      EC: -1,
      EM: 'Error getting product',
      DT: null,
    };
  }
};

// Create product (admin only)
export const createProduct = async (productData) => {
  try {
    const newProduct = await Product.create(productData);
    
    return {
      EC: 0,
      EM: 'Product created successfully',
      DT: newProduct,
    };
  } catch (error) {
    console.error('Create product error:', error);
    return {
      EC: -1,
      EM: 'Error creating product',
      DT: null,
    };
  }
};

// Update product (admin only)
export const updateProduct = async (productId, productData) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: productData },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return {
        EC: 1,
        EM: 'Product not found',
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: 'Product updated successfully',
      DT: product,
    };
  } catch (error) {
    console.error('Update product error:', error);
    return {
      EC: -1,
      EM: 'Error updating product',
      DT: null,
    };
  }
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return {
        EC: 1,
        EM: 'Product not found',
        DT: null,
      };
    }

    return {
      EC: 0,
      EM: 'Product deleted successfully',
      DT: null,
    };
  } catch (error) {
    console.error('Delete product error:', error);
    return {
      EC: -1,
      EM: 'Error deleting product',
      DT: null,
    };
  }
};

