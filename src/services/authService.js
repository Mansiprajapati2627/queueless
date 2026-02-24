import api from './api';

// Mock login – no actual API call
export const login = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@queueless.com' && password === 'admin123') {
        resolve({ user: { email, role: 'admin' }, token: 'mock-token' });
      } else if (email && password) {
        resolve({ user: { email, role: 'customer' }, token: 'mock-token' });
      } else {
        resolve(null);
      }
    }, 500);
  });
};