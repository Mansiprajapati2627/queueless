import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ items = [], onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">Q</div>
        <h2>Queueless</h2>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;