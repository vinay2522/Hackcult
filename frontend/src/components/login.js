import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
      setLoading(false);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Log in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </>
            )}
          </button>
        </form>

        <div className="social-login">
          <div className="social-login-divider">
            <span>Or login with</span>
          </div>
          <div className="social-buttons">
            <button className="social-button google">
              <FontAwesomeIcon icon={faGoogle} /> Google
            </button>
            <button className="social-button facebook">
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;