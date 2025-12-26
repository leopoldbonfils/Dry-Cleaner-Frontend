import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme on mount and changes
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      root.setAttribute('data-theme', 'light');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const handleToggle = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={`theme-icon ${isDark ? 'sun' : 'moon'}`}>
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;