import React from 'react';
import Icon from './Icon';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  icon,
  error,
  required = false,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}{required && ' *'}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ 
            position: 'absolute', 
            left: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#a0aec0'
          }}>
            <Icon name={icon} size={16} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: icon ? '10px 10px 10px 35px' : '10px',
            border: `1px solid ${error ? '#f56565' : '#e2e8f0'}`,
            borderRadius: '4px',
            fontSize: '14px'
          }}
          {...props}
        />
      </div>
      {error && <p style={{ color: '#f56565', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export default Input;