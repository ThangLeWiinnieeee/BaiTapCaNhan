import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Select,
  Slider,
  Button,
  Spin,
  Empty,
  message,
  Tag,
  Row,
  Col,
  Space,
  Collapse,
  Badge,
  Rate,
  Pagination,
  Skeleton,
} from 'antd';
import {
  SearchOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TagOutlined,
  FilterOutlined,
  ClearOutlined,
  SortAscendingOutlined,
  FireOutlined,
  EyeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import axios from '../util/axios.customize';
import '../styles/search.css';

const { Option } = Select;
const { Panel } = Collapse;

const Search = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [appliedFilters, setAppliedFilters] = useState({});

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

  // Fetch products with search and filters
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
      };

      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      if (priceRange[0] > 0) {
        params.minPrice = priceRange[0];
      }
      if (priceRange[1] < 50000000) {
        params.maxPrice = priceRange[1];
      }
      if (minDiscount > 0) {
        params.minDiscount = minDiscount;
      }
      if (minRating > 0) {
        params.minRating = minRating;
      }
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      const response = await axios.get('/api/products/search', { params });

      if (response.EC === 0) {
        setProducts(response.DT.products || []);
        setPagination({
          page: response.DT.pagination.page,
          limit: response.DT.pagination.limit,
          total: response.DT.pagination.total,
          totalPages: response.DT.pagination.totalPages,
        });
        setAppliedFilters(response.DT.filters || {});
      } else {
        message.error(response.EM || 'Failed to search products');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.EM || err.message || 'Failed to search products';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedCategory,
    priceRange,
    minDiscount,
    minRating,
    sortBy,
    sortOrder,
    pagination.limit,
  ]);

  // Handle search button click
  const handleSearch = () => {
    fetchProducts(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, 50000000]);
    setMinDiscount(0);
    setMinRating(0);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Auto search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategory) count++;
    if (priceRange[0] > 0 || priceRange[1] < 50000000) count++;
    if (minDiscount > 0) count++;
    if (minRating > 0) count++;
    return count;
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1 className="search-title">
          <SearchOutlined /> Product Search & Filter
        </h1>
      </div>

      <Row gutter={24}>
        {/* Filters Sidebar */}
        <Col xs={24} lg={6}>
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>
                <FilterOutlined /> Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge
                    count={getActiveFiltersCount()}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </h3>
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                size="small"
              >
                Clear
              </Button>
            </div>

            <div className="filter-section">
              <label className="filter-label">Search</label>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleSearch}
                onKeyPress={handleKeyPress}
                prefix={<SearchOutlined />}
                size="large"
                allowClear
              />
              <Button
                type="default"
                onClick={handleSearch}
                size="large"
                block
                style={{ marginTop: 8 }}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </div>

            <div className="filter-section">
              <label className="filter-label">Category</label>
              <Select
                placeholder="All categories"
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%' }}
                size="large"
                allowClear
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </div>

            <Collapse
              defaultActiveKey={['price', 'discount', 'rating']}
              ghost
              expandIconPosition="end"
            >
              <Panel header="Price Range" key="price">
                <div className="filter-section">
                  <Slider
                    range
                    min={0}
                    max={50000000}
                    step={100000}
                    value={priceRange}
                    onChange={setPriceRange}
                    tooltip={{
                      formatter: (value) => formatPrice(value),
                    }}
                  />
                  <div className="price-range-display">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>-</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </Panel>

              <Panel
                header={
                  <span>
                    <FireOutlined /> Discount
                  </span>
                }
                key="discount"
              >
                <div className="filter-section">
                  <Select
                    value={minDiscount}
                    onChange={setMinDiscount}
                    style={{ width: '100%' }}
                  >
                    <Option value={0}>All Products</Option>
                    <Option value={10}>10% or more</Option>
                    <Option value={20}>20% or more</Option>
                    <Option value={30}>30% or more</Option>
                    <Option value={40}>40% or more</Option>
                    <Option value={50}>50% or more</Option>
                  </Select>
                </div>
              </Panel>

              <Panel
                header={
                  <span>
                    <StarOutlined /> Rating
                  </span>
                }
                key="rating"
              >
                <div className="filter-section">
                  <Select
                    value={minRating}
                    onChange={setMinRating}
                    style={{ width: '100%' }}
                  >
                    <Option value={0}>All Ratings</Option>
                    <Option value={4}>4★ or more</Option>
                    <Option value={4.5}>4.5★ or more</Option>
                  </Select>
                </div>
              </Panel>
            </Collapse>

            <div className="filter-section">
              <label className="filter-label">
                <SortAscendingOutlined /> Sort By
              </label>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%', marginBottom: 8 }}
              >
                <Option value="createdAt">Newest</Option>
                <Option value="price">Price</Option>
                <Option value="name">Name</Option>
                <Option value="views">Views</Option>
                <Option value="rating">Rating</Option>
                <Option value="discount">Discount</Option>
              </Select>
              <Select
                value={sortOrder}
                onChange={setSortOrder}
                style={{ width: '100%' }}
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </div>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              size="large"
              block
              loading={loading}
              style={{ marginTop: 16 }}
            >
              Apply All Filters
            </Button>
          </div>
        </Col>

        {/* Products Grid */}
        <Col xs={24} lg={18}>
          <div className="search-results">
            <div className="results-header">
              <h3>
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    Found <strong>{pagination.total}</strong> products
                    {searchQuery && (
                      <span className="search-query-display">
                        {' '}
                        for "<strong>{searchQuery}</strong>"
                      </span>
                    )}
                  </>
                )}
              </h3>
            </div>

            {loading ? (
              <div className="products-grid">
                {[...Array(pagination.limit)].map((_, index) => (
                  <Card key={index} className="product-card">
                    <Skeleton.Image active style={{ width: '100%', height: 200 }} />
                    <div style={{ padding: 16 }}>
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Empty
                description="No products found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
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
                            <ShoppingOutlined
                              style={{ fontSize: 48, color: '#ccc' }}
                            />
                          </div>
                        )
                      }
                    >
                      <div className="product-info">
                        <div className="product-badges">
                          <Tag color="blue">
                            <TagOutlined /> {product.category}
                          </Tag>
                          {product.discount > 0 && (
                            <Tag color="red">
                              <FireOutlined /> -{product.discount}%
                            </Tag>
                          )}
                        </div>

                        <h3 className="product-name">{product.name}</h3>

                        {product.description && (
                          <p className="product-description">
                            {product.description}
                          </p>
                        )}

                        <div className="product-stats">
                          {product.rating > 0 && (
                            <Space>
                              <Rate
                                disabled
                                value={product.rating}
                                allowHalf
                                style={{ fontSize: 14 }}
                              />
                              <span className="rating-value">
                                {product.rating.toFixed(1)}
                              </span>
                            </Space>
                          )}
                          {product.views > 0 && (
                            <span className="product-views">
                              <EyeOutlined /> {product.views} views
                            </span>
                          )}
                        </div>

                        <div className="product-footer">
                          <div className="product-price">
                            <DollarOutlined /> {formatPrice(product.price)}
                          </div>
                          {product.stock !== undefined && (
                            <div
                              className={`product-stock ${
                                product.stock === 0 ? 'out-of-stock' : ''
                              }`}
                            >
                              {product.stock === 0
                                ? 'Out of stock'
                                : `Stock: ${product.stock}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="pagination-container">
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} products`
                    }
                  />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Search;
