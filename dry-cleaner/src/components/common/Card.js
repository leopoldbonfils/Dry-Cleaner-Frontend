import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  icon,
  className = '',
  noPadding = false 
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">
            {icon && <span className="card-icon">{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className={`card-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;