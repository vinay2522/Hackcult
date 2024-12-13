import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus, faWallet } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      setLoading(false);
      // Handle successful registration (e.g., store token, redirect)
      localStorage.setItem('token', response.data.token);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join our secure evidence management platform</p>
        </div>

        {error && (
          <div className="error-message" style={{
            color: 'red',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            backgroundColor: '#ffebee'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faWallet} className="input-icon" />
              <input
                type="text"
                name="walletAddress"
                placeholder="Wallet Address"
                value={formData.walletAddress}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`register-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} /> Register
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;