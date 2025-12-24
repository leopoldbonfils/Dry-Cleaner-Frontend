import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, label, value, type = 'default' }) => {
  return (
    <div className={`stat-card stat-card-${type}`}>
      <div className="stat-header">
        <div className="stat-info">
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div className={`stat-icon stat-icon-${type}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;