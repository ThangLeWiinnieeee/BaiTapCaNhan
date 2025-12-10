import Product from '../models/product.js';
import Fuse from 'fuse.js';

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

// Search and Filter products with Fuzzy Search
export const searchAndFilterProducts = async (searchParams) => {
  try {
    const {
      query = '',
      category = null,
      minPrice = null,
      maxPrice = null,
      minDiscount = null,
      minRating = null,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = searchParams;

    // Build base query
    const baseQuery = { status: 'active' };

    // Filter by category
    if (category) {
      baseQuery.category = category;
    }

    // Filter by price range
    if (minPrice !== null || maxPrice !== null) {
      baseQuery.price = {};
      if (minPrice !== null) baseQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice !== null) baseQuery.price.$lte = parseFloat(maxPrice);
    }

    // Filter by discount
    if (minDiscount !== null) {
      baseQuery.discount = { $gte: parseFloat(minDiscount) };
    }

    // Filter by rating
    if (minRating !== null) {
      baseQuery.rating = { $gte: parseFloat(minRating) };
    }

    // Get all products matching filters
    const allProducts = await Product.find(baseQuery).lean();

    let filteredProducts = allProducts;

    // Apply Fuzzy Search if query is provided
    if (query && query.trim() !== '') {
      const fuseOptions = {
        keys: [
          { name: 'name', weight: 0.7 },          // Ưu tiên tên sản phẩm nhất
          { name: 'description', weight: 0.2 },   // Mô tả quan trọng thứ 2
          { name: 'category', weight: 0.1 }       // Category ít quan trọng nhất
        ],
        threshold: 0.3,              // Giảm từ 0.4 → 0.3 để chính xác hơn
        includeScore: true,
        minMatchCharLength: 2,       // Ít nhất 2 ký tự mới tìm
        distance: 100,               // Khoảng cách tối đa giữa các match
        ignoreLocation: true,        // Không quan tâm vị trí trong text
        findAllMatches: true,        // Tìm tất cả matches
      };

      const fuse = new Fuse(allProducts, fuseOptions);
      const searchResults = fuse.search(query);
      
      // Extract items from search results
      filteredProducts = searchResults.map(result => result.item);
    }

    // Sort products
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle date sorting
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return -1 * sortOrderValue;
      if (aValue > bValue) return 1 * sortOrderValue;
      return 0;
    });

    // Pagination
    const total = filteredProducts.length;
    const skip = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return {
      EC: 0,
      EM: 'Search and filter products successfully',
      DT: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        filters: {
          query,
          category,
          minPrice,
          maxPrice,
          minDiscount,
          minRating,
          sortBy,
          sortOrder,
        },
      },
    };
  } catch (error) {
    console.error('Search and filter products error:', error);
    return {
      EC: -1,
      EM: 'Error searching and filtering products',
      DT: null,
    };
  }
};
