import React, { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import './Header.css';

const Header = ({ title, onToggleSidebar, onNavigate }) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadUserData();
    
    // Listen for storage changes (when profile image is updated)
    window.addEventListener('storage', loadUserData);
    
    // Also check for updates every second (for same-tab updates)
    const interval = setInterval(loadUserData, 1000);
    
    return () => {
      window.removeEventListener('storage', loadUserData);
      clearInterval(interval);
    };
  }, []);

  const loadUserData = () => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load profile image from localStorage
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    } else {
      setProfileImage(null);
    }
  };

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-right">
        <ThemeToggle />
        <div 
          className="user-avatar" 
          onClick={handleProfileClick}
          title={user?.fullName || 'View Profile'}
        >
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="avatar-image-header"
            />
          ) : (
            getUserInitial()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;