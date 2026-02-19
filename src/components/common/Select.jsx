import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`select-wrapper ${error ? 'select-error' : ''} ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <select className="select-field" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
};

export default Select;