import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';
  const verified = location.state?.verified || false;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Redirect if not verified
    if (!email || !otp || !verified) {
      toast.error('Please verify your OTP first');
      navigate('/forgot-password');
    }
  }, [email, otp, verified, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.warning('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        otp,
        newPassword
      });

      toast.success(response.message || 'Password reset successful!');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
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
              <h1 className="branding-title">Set New Password</h1>
              <p className="branding-description">
                Choose a strong password for your account
              </p>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>

          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Create New Password</h2>
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;