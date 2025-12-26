import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import './LandingPage.css';

// Import your actual screenshots here
// import registerPreview from '../assets/screenshots/register-preview.png';
// import loginPreview from '../assets/screenshots/login-preview.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📦',
      title: 'Order Management',
      description: 'Create, track, and manage all dry cleaning orders in one centralized system.'
    },
    {
      icon: '👥',
      title: 'Customer Tracking',
      description: 'Keep detailed records of customer information and order history.'
    },
    {
      icon: '💳',
      title: 'Payment & Status',
      description: 'Track payment methods, status, and order progress in real-time.'
    },
    {
      icon: '📊',
      title: 'Dashboard & Reports',
      description: 'Get insights with comprehensive analytics and reporting tools.'
    },
    {
      icon: '🔔',
      title: 'Order Notifications',
      description: 'Stay updated with automatic notifications for order status changes.'
    },
    {
      icon: '🔍',
      title: 'Quick Search',
      description: 'Find orders instantly by code, phone number, or customer name.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your CleanPro account in seconds with just basic information.'
    },
    {
      number: '02',
      title: 'Login to System',
      description: 'Access your personalized dashboard with secure authentication.'
    },
    {
      number: '03',
      title: 'Manage Orders',
      description: 'Create new orders, add items, set prices, and track everything.'
    },
    {
      number: '04',
      title: 'Track & Complete',
      description: 'Monitor order status, payments, and mark orders as complete.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🧺</span>
            <span className="logo-text">CleanPro</span>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <button 
              className="btn-ghost"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Modern Dry Cleaning Management</span>
          </div>
          <h1 className="hero-title">
            Smart Management for<br />
            Modern Dry Cleaning
          </h1>
          <p className="hero-description">
            Streamline your dry cleaning business with CleanPro - the all-in-one
            platform for order management, customer tracking, and business insights.
          </p>
          <div className="hero-cta">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/register')}
            >
              <span className="btn-icon">🚀</span>
              Start Free Trial
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Orders Managed</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section className="overview-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Why CleanPro?</span>
            <h2 className="section-title">Built for Dry Cleaning Businesses</h2>
            <p className="section-description">
              CleanPro is designed specifically for dry cleaning shops, laundromats,
              and textile care services who want to modernize their operations.
            </p>
          </div>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon">🎯</div>
              <h3>Who It's For</h3>
              <ul className="overview-list">
                <li>Dry cleaning shop owners</li>
                <li>Laundromat managers</li>
                <li>Textile care services</li>
                <li>Multi-location chains</li>
              </ul>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⚡</div>
              <h3>What It Does</h3>
              <ul className="overview-list">
                <li>Manages customer orders</li>
                <li>Tracks order status</li>
                <li>Processes payments</li>
                <li>Generates business reports</li>
              </ul>
            </div>
            <div className="overview-card">
              <div className="overview-icon">💡</div>
              <h3>Why Choose Us</h3>
              <ul className="overview-list">
                <li>Easy to use interface</li>
                <li>Real-time updates</li>
                <li>Secure & reliable</li>
                <li>Affordable pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-description">
              Powerful features designed to streamline your dry cleaning operations
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Preview Section - EMPHASIZED */}
      <section className="auth-preview-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Get Started</span>
            <h2 className="section-title">Simple & Secure Authentication</h2>
            <p className="section-description">
              Join thousands of businesses managing their operations with CleanPro
            </p>
          </div>
          
          <div className="auth-preview-grid">
            {/* Register Preview */}
            <div className="auth-preview-card register-card">
              <div className="auth-preview-header">
                <div className="auth-badge">
                  <span className="badge-icon">✨</span>
                  New User
                </div>
                <h3>Create Your Account</h3>
                <p>Get started in less than 60 seconds</p>
              </div>
              
              <div className="auth-preview-image-wrapper">
                <div className="auth-preview-image">
                  {/* Replace this div with your actual screenshot */}
                  {/* <img src={registerPreview} alt="Register Page" /> */}
                  <div className="image-placeholder register-placeholder">
                    <div className="placeholder-content">
                      <span className="placeholder-icon">🖼️</span>
                      <p>Register Page Screenshot</p>
                      <small>Replace with actual screenshot</small>
                    </div>
                  </div>
                </div>
                <div className="auth-preview-overlay">
                  <div className="overlay-badge">
                    <span>🔒</span> Secure Registration
                  </div>
                </div>
              </div>
              
              <div className="auth-preview-features">
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>Quick setup process</span>
                </div>
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>No credit card required</span>
                </div>
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>Instant access</span>
                </div>
              </div>
              
              <button 
                className="auth-preview-btn btn-register"
                onClick={() => navigate('/register')}
              >
                <span className="btn-icon">🚀</span>
                Create Account
              </button>
            </div>

            {/* Login Preview */}
            <div className="auth-preview-card login-card">
              <div className="auth-preview-header">
                <div className="auth-badge">
                  <span className="badge-icon">👋</span>
                  Welcome Back
                </div>
                <h3>Login to Dashboard</h3>
                <p>Access your personalized workspace</p>
              </div>
              
              <div className="auth-preview-image-wrapper">
                <div className="auth-preview-image">
                  {/* Replace this div with your actual screenshot */}
                  {/* <img src={loginPreview} alt="Login Page" /> */}
                  <div className="image-placeholder login-placeholder">
                    <div className="placeholder-content">
                      <span className="placeholder-icon">🖼️</span>
                      <p>Login Page Screenshot</p>
                      <small>Replace with actual screenshot</small>
                    </div>
                  </div>
                </div>
                <div className="auth-preview-overlay">
                  <div className="overlay-badge">
                    <span>🛡️</span> Secure Login
                  </div>
                </div>
              </div>
              
              <div className="auth-preview-features">
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>Secure authentication</span>
                </div>
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>Remember me option</span>
                </div>
                <div className="preview-feature">
                  <span className="check-icon">✓</span>
                  <span>Password recovery</span>
                </div>
              </div>
              
              <button 
                className="auth-preview-btn btn-login"
                onClick={() => navigate('/login')}
              >
                <span className="btn-icon">🔓</span>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Get Started in 4 Simple Steps</h2>
            <p className="section-description">
              Start managing your dry cleaning business efficiently in minutes
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Business?</h2>
            <p className="cta-description">
              Join hundreds of dry cleaning businesses already using CleanPro
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-cta-primary"
                onClick={() => navigate('/register')}
              >
                <span className="btn-icon">🚀</span>
                Get Started Free
              </button>
              <button 
                className="btn-cta-secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🧺</span>
              <span className="logo-text">CleanPro</span>
            </div>
            <p className="footer-tagline">
              Smart Management for Modern Dry Cleaning
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#updates">Updates</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#api">API</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CleanPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;