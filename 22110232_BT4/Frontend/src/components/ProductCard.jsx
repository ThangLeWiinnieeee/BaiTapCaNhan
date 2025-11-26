import { Card, Tag, Rate, Space } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined, EyeOutlined, FireOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Card
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
        <div className="product-badges">
          <Tag color="blue" className="product-category">
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
          <p className="product-description">{product.description}</p>
        )}

        {/* Stats section */}
        <div className="product-stats">
          {product.rating > 0 && (
            <Space size="small">
              <Rate
                disabled
                value={product.rating}
                allowHalf
                style={{ fontSize: 14 }}
              />
              <span className="rating-value">{product.rating.toFixed(1)}</span>
            </Space>
          )}
          {product.views > 0 && (
            <div className="product-views">
              <EyeOutlined /> {product.views.toLocaleString()} views
            </div>
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
              {product.stock === 0 ? 'Out of stock' : `Stock: ${product.stock}`}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string,
    stock: PropTypes.number,
    discount: PropTypes.number,
    views: PropTypes.number,
    rating: PropTypes.number,
  }).isRequired,
};

export default ProductCard;
