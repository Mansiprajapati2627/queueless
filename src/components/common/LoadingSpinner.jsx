import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner ${sizeClass} ${colorClass}`}></div>
      </div>
    );
  }

  return <div className={`spinner ${sizeClass} ${colorClass}`}></div>;
};

export default LoadingSpinner;