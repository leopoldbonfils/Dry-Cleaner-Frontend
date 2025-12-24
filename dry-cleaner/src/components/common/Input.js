import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  error,
  icon,
  className = ''
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`input-field ${icon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export const Select = ({ 
  label, 
  value, 
  onChange, 
  options,
  required = false,
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input-field select-field ${error ? 'error' : ''}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;