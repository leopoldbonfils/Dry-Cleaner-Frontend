import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.warning('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email });
      
      toast.success(response.message || 'Reset code sent to your email!');
      
      setTimeout(() => {
        navigate('/verify-reset-otp', { state: { email } });
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to send reset code');
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
              <h1 className="branding-title">Forgot Password?</h1>
              <p className="branding-description">
                Enter your email and we'll send you a reset code
              </p>
            </div>
            
            <div className="branding-footer">
              <button className="back-to-home" onClick={() => navigate('/login')}>
                ← Back to Login
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
              <h2>Reset Password</h2>
              <p>Enter your email address to receive a reset code</p>
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

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <button className="auth-link" onClick={() => navigate('/login')}>
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;