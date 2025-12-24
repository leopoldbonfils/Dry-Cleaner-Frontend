import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';
import './StatusBadge.css';

const StatusBadge = ({ status, size = 'medium' }) => {
  const backgroundColor = STATUS_COLORS[status] || '#78909C';
  
  return (
    <span 
      className={`status-badge status-${size}`}
      style={{ backgroundColor }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;