import React from 'react';
import { MENU_ITEMS } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({ currentView, onNavigate, collapsed, open }) => {
  return (
    <nav className={`navigation ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>
      <div className="nav-header">
        <div className="logo">
          <div className="logo-icon">🧺</div>
          {!collapsed && (
            <div className="logo-text">
              <h1>CleanPro</h1>
              <p>Dry Cleaning System</p>
            </div>
          )}
        </div>
      </div>

      <div className="nav-menu">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
            onClick={() => !item.disabled && onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-text">{item.label}</span>}
          </div>
        ))}
      </div>

      <button 
        className="new-order-btn"
        onClick={() => onNavigate('new-order')}
      >
        <span>➕</span>
        {!collapsed && <span className="btn-text">New Order</span>}
      </button>
    </nav>
  );
};

export default Navigation;