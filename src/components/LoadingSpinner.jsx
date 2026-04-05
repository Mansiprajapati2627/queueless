import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-page">
    <div className="loading-ring" />
    <div className="loading-dots">
      <span /><span /><span />
    </div>
    <p className="loading-text">{message}</p>
  </div>
);

export default LoadingSpinner;