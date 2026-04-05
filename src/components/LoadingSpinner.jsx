import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-page">
    <div className="loading-plate" />
    <p className="loading-text">{message}</p>
  </div>
);

export default LoadingSpinner;