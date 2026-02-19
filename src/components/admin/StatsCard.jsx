import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  return (
    <div className={`stats-card stats-${color}`}>
      <div className="stats-icon">
        <Icon />
      </div>
      <div className="stats-info">
        <h3>{value}</h3>
        <p>{title}</p>
        {trend && (
          <span className={`stats-trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;