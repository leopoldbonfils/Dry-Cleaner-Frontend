import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MENU_ITEMS } from '../../utils/constants';
import './Navigation.css';

/*  Confirm Modal  */
const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmLabel = 'Yes', confirmClass = 'modal-btn-confirm' }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <h3 className="modal-title">{title}</h3>
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button className="modal-btn modal-btn-cancel" onClick={onCancel}>Cancel</button>
        <button className={`modal-btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

/*  Navigation  */
const Navigation = ({ currentView, onNavigate, collapsed, open }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const businessName = user.businessName || 'CleanPro';

  const menuWithNewOrder = [
    MENU_ITEMS[0],
    { id: 'new-order', label: 'New Order', icon: '➕', isAction: true },
    ...MENU_ITEMS.slice(1)
  ];

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    toast.info('Logged out successfully', { position: 'top-right', autoClose: 2000 });
    setTimeout(() => navigate('/login'), 500);
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ConfirmModal
          title="Logout"
          message="Are you sure you want to logout?"
          confirmLabel="Yes, Logout"
          confirmClass="modal-btn-danger"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <nav className={`nav-sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>
        {/* Header with Logo */}
        <div className="nav-header">
          <div className="logo">
            <div className="logo-icon">🧺</div>
            {!collapsed && (
              <div className="logo-text">
                <h1>{businessName}</h1>
                <p>Dry Cleaning</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <div className="nav-menu">
          {menuWithNewOrder.map((item) => {
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
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
          >
            <span className="logout-icon">🚪</span>
            {!collapsed && <span className="logout-text">Logout</span>}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;