import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const data = customerService.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const getCustomerById = (email) => {
    return customers.find(c => c.email === email);
  };

  const deleteCustomer = (email) => {
    const success = customerService.deleteCustomer(email);
    if (success) {
      setCustomers(prev => prev.filter(c => c.email !== email));
    }
    return success;
  };

  const exportCustomers = () => {
    customerService.exportCustomers(customers);
  };

  const getCustomerStats = () => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      avgSpending: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length 
        : 0
    };
  };

  return {
    customers,
    loading,
    getCustomerById,
    deleteCustomer,
    exportCustomers,
    getCustomerStats,
    refreshCustomers: loadCustomers
  };
};