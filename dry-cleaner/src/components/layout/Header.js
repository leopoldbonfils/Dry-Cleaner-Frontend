import React from 'react';
import './Header.css';

const Header = ({ title, onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="user-avatar">A</div>
      </div>
    </header>
  );
};

export default Header;