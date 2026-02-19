import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';

const AdminHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const headerStyle = {
    background: 'white',
    padding: '15px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={headerStyle}>
      <div>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Admin Dashboard</h2>
        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#718096' }}>
          {formatDate(currentTime)}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Icon name="notification" size={20} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#f56565',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            3
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '35px',
            height: '35px',
            background: '#667eea',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;