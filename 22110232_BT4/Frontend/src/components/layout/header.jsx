import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { LogoutOutlined, UserOutlined, HomeOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import '../../styles/header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <HomeOutlined /> FullStack App
        </Link>

        <nav className="nav-menu">
          <Link to="/products" className="nav-link">
            <ShoppingOutlined /> Products
          </Link>
          <Link to="/search" className="nav-link">
            <SearchOutlined /> Search
          </Link>
          {isAuthenticated ? (
            <>
              <span className="user-info">
                <UserOutlined /> {user?.fullname || user?.email}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <LogoutOutlined /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;