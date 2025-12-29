import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES, preloadSlideshowImages } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    preloadSlideshowImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({
        email,
        password
      });

      // ✅ Check if OTP verification is required
      if (response.requiresVerification) {
        toast.info(response.message || 'Please verify your account');
        setTimeout(() => {
          navigate('/verify-otp', { 
            state: { 
              email,
              fromRegistration: false
            } 
          });
        }, 1500);
        return;
      }

      // This code won't run now since we always require OTP
      toast.success(response.message || 'Login successful! 🎉');
      
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      }
      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-branding auth-slideshow-section">
          <ImageSlideshow
            images={SLIDESHOW_IMAGES.login}
            interval={4000}
            transition="fade"
            showCaptions={true}
            showIndicators={true}
            className="auth-slideshow"
          />
          
          <div className="auth-branding-overlay">
            <div className="branding-content">
              <div className="brand-logo">
                <span className="logo-icon">🧺</span>
                <span className="logo-text">CleanPro</span>
              </div>
              <h1 className="branding-title">Welcome Back!</h1>
              <p className="branding-description">
                Sign in to access your dry cleaning management dashboard
              </p>
            </div>
            
            <div className="branding-footer">
              <button className="back-to-home" onClick={() => navigate('/')}>
                ← Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>

          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <button className="auth-link" onClick={() => navigate('/register')}>
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;