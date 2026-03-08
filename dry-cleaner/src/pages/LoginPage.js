import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES, preloadSlideshowImages } from '../config/slideshowImages';
import { authAPI } from '../components/services/api';
import './AuthPages.css';

//  Validation helpers 
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Per-field error states for inline feedback
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    preloadSlideshowImages();
  }, []);

  //  Real-time field validation 
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  //  Submit 
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  1. Required fields 
    if (!email.trim() && !password) {
      toast.warning('Please enter your email and password', { position: 'top-center', autoClose: 3500 });
      return;
    }
    if (!email.trim()) {
      toast.warning('Please enter your email address', { position: 'top-center', autoClose: 3500 });
      return;
    }
    if (!password) {
      toast.warning('Please enter your password', { position: 'top-center', autoClose: 3500 });
      return;
    }

    //  2. Email format 
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      toast.error('Invalid email address format', { position: 'top-center', autoClose: 3500 });
      return;
    }

    //  3. Password length 
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters long', { position: 'top-center', autoClose: 3500 });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ 
        email: email.trim(), 
        password 
      });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email.trim());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (response.requiresVerification) {
        toast.info(response.message || 'Please verify your account', { position: 'top-center', autoClose: 3000 });
        setTimeout(() => {
          navigate('/verify-otp', { 
            state: { email: 
              email.trim(), 
              fromRegistration: false 
            } 
          });
        }, 1500);
        return;
      }

      toast.success(response.message || 'Login successful! 🎉', { position: 'top-center', autoClose: 2000 });
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      const msg = error.message || 'Login failed. Please try again.';

      // ── Map backend messages to specific field highlights ──
      if (
        msg.toLowerCase().includes('wrong password') ||
        msg.toLowerCase().includes('incorrect password')
      ) {
        setPasswordError('Wrong password');
        toast.error('Wrong password, please try again', {
          position: 'top-center',
          autoClose: 4000,
          icon: '🔒',
        });
      } else if (
        msg.toLowerCase().includes('no account') ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('invalid email')
      ) {
        setEmailError('No account found with this email');
        toast.error('No account found with this email address', {
          position: 'top-center',
          autoClose: 4000,
          icon: '📧',
        });
      } else {
        toast.error(msg, { position: 'top-center', autoClose: 4000 });
      }
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
                 Back to Home
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

            <form onSubmit={handleSubmit} className="auth-form" noValidate>

              {/*  Email  */}
              <div className={`form-group ${emailError ? 'has-error' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => {
                    if (email && !isValidEmail(email)) setEmailError('Please enter a valid email address');
                  }}
                  className={emailError ? 'input-error' : ''}
                  autoComplete="email"
                />
                {emailError && <span className="field-error-msg">{emailError}</span>}
              </div>

              {/*  Password  */}
              <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="pw-field-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={passwordError ? 'input-error' : ''}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <span className="field-error-msg">{passwordError}</span>}
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
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </button>
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