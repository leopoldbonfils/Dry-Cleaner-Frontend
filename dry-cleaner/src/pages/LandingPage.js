// src/pages/LandingPage.js (COMPLETE REDESIGN)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import ImageSlideshow from '../components/common/ImageSlideshow';
import { SLIDESHOW_IMAGES, preloadSlideshowImages } from '../config/slideshowImages';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    preloadSlideshowImages();
    
    // Handle scroll for nav background
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '📦',
      title: 'Order Management',
      description: 'Create, track, and manage all dry cleaning orders in one centralized system with real-time updates and status tracking.'
    },
    {
      icon: '👥',
      title: 'Customer Tracking',
      description: 'Keep detailed records of customer information, preferences, and complete order history for personalized service.'
    },
    {
      icon: '💳',
      title: 'Payment & Status',
      description: 'Track payment methods, status, and order progress with automated notifications and payment reminders.'
    },
    {
      icon: '📊',
      title: 'Dashboard & Reports',
      description: 'Get insights with comprehensive analytics, revenue reports, and business metrics at your fingertips.'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Stay updated with automatic notifications for order status changes, payments, and important updates.'
    },
    {
      icon: '🔍',
      title: 'Quick Search',
      description: 'Find orders instantly by code, phone number, or customer name with advanced filters and sorting.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your CleanPro account in seconds with just basic information. No credit card required.',
      icon: '✍️'
    },
    {
      number: '02',
      title: 'Login to System',
      description: 'Access your personalized dashboard with secure authentication and start managing orders.',
      icon: '🔐'
    },
    {
      number: '03',
      title: 'Manage Orders',
      description: 'Create new orders, add items, set prices, and track everything from one central dashboard.',
      icon: '📋'
    },
    {
      number: '04',
      title: 'Track & Complete',
      description: 'Monitor order status, payments, and mark orders as complete with automated customer notifications.',
      icon: '✅'
    }
  ];

  const testimonials = [
    {
      name: 'Jean Marie Nkurunziza',
      role: 'Owner, Fresh Clean Laundry',
      avatar: '👨‍💼',
      rating: 5,
      text: 'CleanPro has completely transformed how we manage our dry cleaning business. Order tracking is now seamless, efficient, and our customers absolutely love the transparency!'
    },
    {
      name: 'Alice Uwase',
      role: 'Manager, Sparkle Dry Cleaners',
      avatar: '👩‍💼',
      rating: 5,
      text: 'The payment tracking and customer management features are outstanding. We\'ve reduced errors by 80% and saved countless hours since switching to CleanPro.'
    },
    {
      name: 'Patrick Mugabo',
      role: 'Owner, Prime Laundry Services',
      avatar: '👨‍💼',
      rating: 5,
      text: 'Best investment for our business! The dashboard gives us real-time insights and helps us make better decisions daily. Customer service is also excellent!'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with CleanPro?',
      answer: 'Simply click the "Get Started" button, create your free account, and you\'ll be up and running in less than 5 minutes. No credit card required for the free plan.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption and security measures to protect your data. All information is backed up daily and stored securely in compliance with data protection regulations.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! We offer email support for all users, and priority support for Professional and Enterprise plans. Our team typically responds within 24 hours, often much faster.'
    },
    {
      question: 'Can I import my existing customer data?',
      answer: 'Yes, we provide tools to import your existing customer and order data from CSV files or other systems. Our support team can help with the migration process to ensure a smooth transition.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'CleanPro is fully responsive and works great on mobile browsers. Native iOS and Android apps are coming soon! You\'ll be notified when they launch.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and mobile payment methods. You can manage your subscription easily from your account dashboard at any time.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🧺</span>
            <span className="logo-text">CleanPro</span>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <button className="btn-ghost" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Slideshow */}
      <section className="hero-section-slideshow">
        <div className="hero-slideshow-container">
          <div className="hero-slideshow-wrapper">
            <ImageSlideshow
              images={SLIDESHOW_IMAGES.landing}
              interval={5000}
              transition="fade"
              showCaptions={false}
              showIndicators={true}
              className="hero-slideshow"
            />
            <div className="hero-slideshow-overlay"></div>
          </div>

          <div className="hero-content-overlay">
            <div className="hero-content-wrapper">
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
                <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                  <span className="btn-icon">🚀</span>
                  <span>Start Free Trial</span>
                </button>
                <button className="btn-hero-secondary" onClick={() => navigate('/login')}>
                  <span>Sign In</span>
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Orders Managed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
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
              and help you deliver exceptional customer service.
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

      {/* How It Works Section */}
      <section className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Get Started in 4 Simple Steps</h2>
            <p className="section-description">
              Start managing your dry cleaning business efficiently in minutes.
              No technical knowledge required.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Loved by Businesses Worldwide</h2>
            <p className="section-description">
              See what our customers have to say about CleanPro and how it
              transformed their business operations.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Everything you need to know about CleanPro. Can't find the answer
              you're looking for? Contact our support team.
            </p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">
                  <span className="faq-icon">❓</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Business?</h2>
            <p className="cta-description">
              Join hundreds of dry cleaning businesses already using CleanPro to
              streamline operations and boost customer satisfaction.
            </p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate('/register')}>
                <span className="btn-icon">🚀</span>
                <span>Get Started Free</span>
              </button>
              <button className="btn-cta-secondary" onClick={() => navigate('/login')}>
                <span>Sign In</span>
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
            <div className="footer-social">
              <a href="#facebook" className="social-link" aria-label="Facebook">📘</a>
              <a href="#twitter" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#instagram" className="social-link" aria-label="Instagram">📷</a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#api">API</a>
              <a href="#status">Status</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#security">Security</a>
              <a href="#gdpr">GDPR</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 CleanPro. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;