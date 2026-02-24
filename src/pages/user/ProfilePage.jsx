import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Profile</h2>
        <p>You are not logged in.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfilePage;