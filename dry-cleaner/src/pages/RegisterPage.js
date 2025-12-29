import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES, preloadSlideshowImages } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    preloadSlideshowImages();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.warning('Please fill in all required fields');
      return;       
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!agreedToTerms) {
      toast.warning('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        password: formData.password
      });

      toast.success(response.message || 'Registration successful! 🎉');
      
      // ✅ Redirect to LOGIN page (not OTP page)
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-branding auth-slideshow-section">
          <ImageSlideshow
            images={SLIDESHOW_IMAGES.register}
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
              <h1 className="branding-title">Start Your Journey</h1>
              <p className="branding-description">
                Create your account and start managing your dry cleaning business efficiently
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
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span>I agree to the Terms and Conditions</span>
                </label>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
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

export default RegisterPage;