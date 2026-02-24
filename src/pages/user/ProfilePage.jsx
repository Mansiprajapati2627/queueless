import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login(email, password);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>Demo: admin@queueless.com / admin123</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === 'admin' && <Link to="/admin">Go to Admin Dashboard</Link>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfilePage;

