import React from 'react';
import { MENU_ITEMS } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({ currentView, onNavigate, collapsed, open }) => {
  // Insert "New Order" button after Dashboard (index 1)
  const menuWithNewOrder = [
    MENU_ITEMS[0], // Dashboard
    { id: 'new-order', label: 'New Order', icon: '➕', isAction: true }, // New Order as button
    ...MENU_ITEMS.slice(1) // Rest of menu
  ];

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    // TODO: Implement actual logout logic
    alert('Logout functionality coming soon!');
  };

  return (
    <nav className={`nav-sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>
      {/* Header with Logo */}
      <div className="nav-header">
        <div className="logo">
          <div className="logo-icon">🧺</div>
          {!collapsed && (
            <div className="logo-text">
              <h1>CleanPro</h1>
              <p>Dry Cleaning</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Menu */}
      <div className="nav-menu">
        {menuWithNewOrder.map((item) => {
          // Render "New Order" as a special action button
          if (item.isAction) {
            return (
              <button
                key={item.id}
                className="nav-action-btn"
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-text">{item.label}</span>}
              </button>
            );
          }

          // Regular menu items
          return (
            <div
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
              onClick={() => !item.disabled && onNavigate(item.id)}
              title={collapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-text">{item.label}</span>}
            </div>
          );
        })}
      </div>

      {/* Footer with Logout */}
      <div className="nav-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="logout-icon">🚪</span>
          {!collapsed && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;