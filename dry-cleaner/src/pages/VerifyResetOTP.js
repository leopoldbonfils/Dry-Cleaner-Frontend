import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const VerifyResetOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.warning('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyResetOTP({
        email,
        otp: otpCode
      });

      toast.success(response.message || 'OTP verified!');
      
      // ✅ Pass email AND otp to reset password page
      setTimeout(() => {
        navigate('/reset-password', { 
          state: { 
            email,
            otp: otpCode,
            verified: true
          } 
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const response = await authAPI.forgotPassword({ email });
      toast.success(response.message || 'New code sent!');
      setTimer(60);
    } catch (error) {
      toast.error(error.message || 'Failed to resend code');
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
              <h1 className="branding-title">Verify Reset Code</h1>
              <p className="branding-description">
                Enter the 6-digit code we sent to your email
              </p>
            </div>
            
            <div className="branding-footer">
              <button className="back-to-home" onClick={() => navigate('/forgot-password')}>
                ← Back
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
              <h2>Enter Verification Code</h2>
              <p>Code sent to: <strong>{email}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="otp-input-group">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Didn't receive the code?{' '}
                {timer > 0 ? (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Resend in {timer}s
                  </span>
                ) : (
                  <button 
                    className="auth-link" 
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOTP;