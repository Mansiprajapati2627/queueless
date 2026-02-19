import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Alert = ({ 
  message, 
  type = 'info', 
  onClose,
  dismissible = true 
}) => {
  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
    warning: <FiAlertCircle />,
    info: <FiInfo />
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-message">{message}</div>
      {dismissible && (
        <button className="alert-close" onClick={onClose}>
          <FiX />
        </button>
      )}
    </div>
  );
};

export default Alert;