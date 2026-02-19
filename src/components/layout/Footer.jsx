import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Queueless</h4>
          <p>Skip the line, enjoy your meal</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@queueless.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Queueless. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;