import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock authentication – in real app would call API
    if (email === 'admin@queueless.com' && password === 'admin123') {
      setUser({
        email,
        role: 'admin',
        name: 'Admin User',
        phone: '+1 234 567 8900'
      });
      return true;
    } else if (email && password) {
      // Check if user exists in localStorage (simulate database)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser({
          email: foundUser.email,
          role: 'customer',
          name: foundUser.name,
          phone: foundUser.phone || '+1 987 654 3210'
        });
        return true;
      }
      return false;
    }
    return false;
  };

  const register = (name, email, password, phone) => {
    // Simulate saving user to "database"
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { name, email, password, phone: phone || '+1 987 654 3210', role: 'customer' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Automatically log in the new user
    setUser({
      email: newUser.email,
      role: 'customer',
      name: newUser.name,
      phone: newUser.phone
    });
    return { success: true };
  };

  const logout = () => setUser(null);

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