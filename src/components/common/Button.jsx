import React from 'react';
import Icon from './Icon';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = ''
}) => {
  const baseStyle = {
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 20px',
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '14px',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  };

  const variants = {
    primary: {
      background: '#667eea',
      color: 'white',
      hover: '#5a67d8'
    },
    secondary: {
      background: '#48bb78',
      color: 'white',
      hover: '#38a169'
    },
    danger: {
      background: '#f56565',
      color: 'white',
      hover: '#e53e3e'
    },
    outline: {
      background: 'transparent',
      color: '#667eea',
      border: '1px solid #667eea',
      hover: '#ebf4ff'
    }
  };

  const variantStyle = variants[variant] || variants.primary;

  const buttonStyle = {
    ...baseStyle,
    backgroundColor: variantStyle.background,
    color: variantStyle.color,
    border: variantStyle.border
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled && variantStyle.hover) {
          e.target.style.backgroundColor = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = variantStyle.background;
        }
      }}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};

export default Button;