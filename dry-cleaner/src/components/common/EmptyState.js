import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '📦', message = 'No data available' }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default EmptyState;