import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    console.log('Login attempt:', { email, password }); // Debug

    // Trim and normalize
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Hardcoded admin check
    if (trimmedEmail === 'admin@queueless.com' && trimmedPassword === 'admin123') {
      console.log('Admin login successful');
      setUser({
        email: trimmedEmail,
        role: 'admin',
        name: 'Admin User',
        phone: '+1 234 567 8900'
      });
      return true;
    }

    // Check registered users in localStorage
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => 
        u.email.toLowerCase() === trimmedEmail && u.password === trimmedPassword
      );
      if (foundUser) {
        console.log('Customer login successful');
        setUser({
          email: foundUser.email,
          role: 'customer',
          name: foundUser.name,
          phone: foundUser.phone || '+1 987 654 3210'
        });
        return true;
      }
    } catch (e) {
      console.error('Error reading users from localStorage', e);
    }

    console.log('Login failed');
    return false;
  };

  const register = (name, email, password, phone) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = { 
      name: name.trim(), 
      email: trimmedEmail, 
      password: password.trim(), 
      phone: phone?.trim() || '+1 987 654 3210', 
      role: 'customer' 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login
    setUser({
      email: newUser.email,
      role: 'customer',
      name: newUser.name,
      phone: newUser.phone
    });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('users'); // Optional: don't clear on logout
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = useMemo(() => ({
    user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer' || !user,
    login,
    register,
    logout,
    updateProfile
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);