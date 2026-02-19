export const login = async (credentials) => {
  // Demo login - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.email === 'admin@queueless.com' && credentials.password === 'admin123') {
        resolve({
          success: true,
          user: {
            id: '1',
            name: 'Admin User',
            email: credentials.email,
            role: 'admin'
          },
          token: 'demo-token-admin'
        });
      } else if (credentials.email === 'kitchen@queueless.com' && credentials.password === 'kitchen123') {
        resolve({
          success: true,
          user: {
            id: '2',
            name: 'Kitchen Staff',
            email: credentials.email,
            role: 'kitchen'
          },
          token: 'demo-token-kitchen'
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }, 500);
  });
};

export const logout = () => {
  localStorage.removeItem('queueless_token');
  localStorage.removeItem('queueless_user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('queueless_user');
  return userStr ? JSON.parse(userStr) : null;
};