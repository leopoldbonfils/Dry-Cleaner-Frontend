import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, or system preference, or default to dark
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark || true;
    
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const handleToggle = () => {
    setIsAnimating(true);
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      className={`theme-toggle ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <div className="toggle-track">
        <span className={`toggle-icon sun-icon ${isDark ? 'active' : ''}`}>
          ☀️
        </span>
        <span className={`toggle-icon moon-icon ${!isDark ? 'active' : ''}`}>
          🌙
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
