import React from 'react';

const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    // Navigation
    home: '🏠',
    menu: '📋',
    cart: '🛒',
    orders: '📦',
    profile: '👤',
    scan: '📱',
    qr: '📱',
    
    // Actions
    add: '➕',
    plus: '➕',
    minus: '➖',
    delete: '🗑️',
    edit: '✏️',
    save: '💾',
    cancel: '❌',
    close: '✕',
    search: '🔍',
    filter: '🔍',
    
    // Status
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    check: '✓',
    x: '✕',
    
    // Time
    clock: '⏰',
    time: '⏰',
    calendar: '📅',
    
    // Finance
    money: '💰',
    dollar: '💰',
    payment: '💳',
    card: '💳',
    
    // Users
    user: '👤',
    users: '👥',
    customer: '👤',
    
    // Food
    food: '🍽️',
    coffee: '☕',
    restaurant: '🍽️',
    
    // Communication
    email: '📧',
    mail: '📧',
    phone: '📱',
    notification: '🔔',
    bell: '🔔',
    
    // Misc
    location: '📍',
    map: '📍',
    download: '⬇️',
    upload: '⬆️',
    settings: '⚙️',
    gear: '⚙️',
    dashboard: '📊',
    chart: '📊',
    graph: '📊',
    table: '🪑',
    logout: '🚪',
    login: '🔑',
    lock: '🔒',
    unlock: '🔓',
    star: '⭐',
    heart: '❤️',
    print: '🖨️',
    copy: '📋',
    view: '👁️',
    eye: '👁️',
    camera: '📷',
    
    // Arrows
    arrowLeft: '←',
    arrowRight: '→',
    arrowUp: '↑',
    arrowDown: '↓',
    chevronLeft: '‹',
    chevronRight: '›',
    back: '←',
    next: '→',
    
    // Default
    default: '•'
  };

  const iconChar = icons[name] || icons.default;

  return (
    <span 
      className={`icon ${className}`}
      style={{ 
        fontSize: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size
      }}
      role="img"
      aria-label={name}
    >
      {iconChar}
    </span>
  );
};

export default Icon;