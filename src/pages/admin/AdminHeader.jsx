import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
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
    <header className="admin-header">
      <div className="header-left">
        <h1>Welcome back, {user?.name}</h1>
        <p className="date-time">{formatDateTime(currentDateTime)}</p>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="header-actions">
          <div className="notification-wrapper">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button>Mark all as read</button>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <p>New order #1234 received</p>
                    <span>2 min ago</span>
                  </div>
                  <div className="notification-item unread">
                    <p>Payment received for order #1230</p>
                    <span>15 min ago</span>
                  </div>
                  <div className="notification-item">
                    <p>Table 5 is now available</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="user-menu">
            <div className="user-avatar">
              <FiUser />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;