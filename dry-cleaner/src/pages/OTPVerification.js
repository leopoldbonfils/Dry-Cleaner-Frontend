import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const fromRegistration = location.state?.fromRegistration || false;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/login');
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

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
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
      const response = await authAPI.verifyOTP({
        email,
        otp: otpCode
      });

      toast.success(response.message || 'Account verified successfully! 🎉');
      
      // Redirect to login or dashboard
      if (fromRegistration) {
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
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

    setResending(true);
    try {
      const response = await authAPI.resendOTP(email);
      toast.success(response.message || 'New code sent to your email!');
      setTimer(60);
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <span className="logo-icon">🧺</span>
              <span className="logo-text">CleanPro</span>
            </div>
            <h1 className="branding-title">Verify Your Email</h1>
            <p className="branding-description">
              We've sent a 6-digit verification code to your email address
            </p>
          </div>
          
          <div className="branding-footer">
            <button className="back-to-home" onClick={() => navigate('/login')}>
              ← Back to Login
            </button>
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
                    onPaste={handlePaste}
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
                    disabled={resending}
                  >
                    {resending ? 'Sending...' : 'Resend Code'}
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

export default OTPVerification;