import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from '../util/axios.customize';
import '../styles/auth.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      const response = await axios.post('/api/register', registerData);
      
      if (response.EC === 0) {
        message.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        // Handle validation errors from backend
        if (response.DT && Array.isArray(response.DT)) {
          const errorMessages = response.DT.map(err => err.msg || err.message).join(', ');
          message.error(errorMessages || response.EM || 'Registration failed');
        } else {
          message.error(response.EM || 'Registration failed');
        }
      }
    } catch (error) {
      if (error.response?.data?.DT && Array.isArray(error.response.data.DT)) {
        const errorMessages = error.response.data.DT.map(err => err.msg || err.message).join(', ');
        message.error(errorMessages || error.response?.data?.EM || 'Registration failed. Please try again.');
      } else {
        message.error(error.response?.data?.EM || error.EM || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { max: 50, message: 'Username cannot exceed 50 characters!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores!' },
              { whitespace: true, message: 'Username cannot be empty!' }
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
              { whitespace: true, message: 'Email cannot be empty!' }
            ]}
            hasFeedback
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
              }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { 
                pattern: /^[0-9+\-\s()]*$/,
                message: 'Please enter a valid phone number!'
              }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone (optional)"
              size="large"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[
              { max: 200, message: 'Address cannot exceed 200 characters!' }
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Address (optional)"
              size="large"
              autoComplete="street-address"
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
              Register
            </Button>
          </Form.Item>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;