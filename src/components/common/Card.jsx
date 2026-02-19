import React from 'react';
import Icon from './Icon';

const Card = ({ children, title, icon, className = '', onClick }) => {
  const cardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    height: '100%'
  };

  return (
    <div 
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
    >
      {(title || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          {icon && <Icon name={icon} size={24} />}
          {title && <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;