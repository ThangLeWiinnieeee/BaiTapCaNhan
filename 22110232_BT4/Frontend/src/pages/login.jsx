import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import axios from '../util/axios.customize';
import '../styles/auth.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', values);
      
      if (response.EC === 0) {
        // Save token and user info
        localStorage.setItem('access_token', response.DT.access_token);
        localStorage.setItem('user', JSON.stringify(response.DT.user));
        
        // Update context
        setUser(response.DT.user);
        setIsAuthenticated(true);
        
        message.success('Login successful!');
        navigate('/');
      } else {
        message.error(response.EM || 'Login failed');
      }
    } catch (error) {
      message.error(error.EM || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;