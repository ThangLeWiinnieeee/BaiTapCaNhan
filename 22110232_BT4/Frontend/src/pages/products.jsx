import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Spin, Select, Empty, message, Tag } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined } from '@ant-design/icons';
import axios from '../util/axios.customize';
import '../styles/products.css';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);
  const isLoadingRef = useRef(false);
  const limit = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        if (response.EC === 0) {
          setCategories(response.DT || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async (pageNum, category, reset = false) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pageNum,
        limit: limit,
      };
      
      if (category) {
        params.category = category;
      }

      const response = await axios.get('/api/products', { params });
      
      if (response.EC === 0) {
        const newProducts = response.DT.products || [];
        const pagination = response.DT.pagination || {};
        
        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        
        setHasMore(pagination.hasNext || false);
        setPage(pageNum);
      } else {
        setError(response.EM || 'Failed to fetch products');
        message.error(response.EM || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.EM || err.message || 'Failed to fetch products';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [limit]);

  // Initial load and category change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, selectedCategory, true);
  }, [selectedCategory]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts(page + 1, selectedCategory, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, selectedCategory, fetchProducts]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value || null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">
          <ShoppingOutlined /> Products
        </h1>
        <div className="category-filter">
          <Select
            placeholder="Filter by category"
            allowClear
            style={{ width: 250 }}
            size="large"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <Option value={null}>All Categories</Option>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {error && !loading && (
        <div className="error-message">
          <Empty description={error} />
        </div>
      )}

      {!error && (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <Card
                key={product._id}
                className="product-card"
                hoverable
                cover={
                  product.image ? (
                    <img
                      alt={product.name}
                      src={product.image}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <ShoppingOutlined style={{ fontSize: 48, color: '#ccc' }} />
                    </div>
                  )
                }
              >
                <div className="product-info">
                  <Tag color="blue" className="product-category">
                    <TagOutlined /> {product.category}
                  </Tag>
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                  <div className="product-footer">
                    <div className="product-price">
                      <DollarOutlined /> {formatPrice(product.price)}
                    </div>
                    {product.stock !== undefined && (
                      <div className="product-stock">
                        Stock: {product.stock}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {loading && products.length === 0 && (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          )}

          {products.length === 0 && !loading && !error && (
            <Empty description="No products found" />
          )}

          {hasMore && products.length > 0 && (
            <div ref={observerTarget} className="observer-target">
              {loading && (
                <div className="loading-more">
                  <Spin /> Loading more products...
                </div>
              )}
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="end-message">
              <p>No more products to load</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

