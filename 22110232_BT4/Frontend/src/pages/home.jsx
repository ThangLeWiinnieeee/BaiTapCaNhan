import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { Card, Spin, Alert } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from '../util/axios.customize';
import '../styles/home.css';

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiData();
    }
  }, [isAuthenticated]);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api');
      if (response.EC === 0) {
        setApiData(response.DT);
      }
    } catch (err) {
      setError(err.EM || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to FullStack App</h1>
        
        {!isAuthenticated ? (
          <Card className="info-card">
            <p>Please login to access all features.</p>
          </Card>
        ) : (
          <>
            <Card className="info-card user-card">
              <h2><UserOutlined /> User Information</h2>
              <div className="user-details">
                <p><strong>Username:</strong> {user?.username}</p>
                <p><MailOutlined /> <strong>Email:</strong> {user?.email}</p>
                {user?.phone && (
                  <p><PhoneOutlined /> <strong>Phone:</strong> {user?.phone}</p>
                )}
                {user?.address && (
                  <p><HomeOutlined /> <strong>Address:</strong> {user?.address}</p>
                )}
              </div>
            </Card>

            <Card className="info-card api-card">
              <h2>API Response</h2>
              {loading ? (
                <Spin size="large" />
              ) : error ? (
                <Alert message="Error" description={error} type="error" />
              ) : apiData ? (
                <div className="api-data">
                  <p><strong>Message:</strong> {apiData.message}</p>
                  <p><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleString()}</p>
                </div>
              ) : null}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;