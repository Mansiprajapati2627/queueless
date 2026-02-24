import React, { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null or { email, role }

  const login = (email, password) => {
    // Mock authentication
    if (email === 'admin@queueless.com' && password === 'admin123') {
      setUser({ email, role: 'admin' });
      return true;
    } else if (email && password) {
      // any non-admin credentials become customer
      setUser({ email, role: 'customer' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({
    user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer' || !user, // customer can be null too
    login,
    logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);