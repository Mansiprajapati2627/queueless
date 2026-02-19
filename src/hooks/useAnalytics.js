import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (period = 'week') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = () => {
    const analyticsData = analyticsService.getAnalytics(period);
    setData(analyticsData);
    setLoading(false);
  };

  const getRevenueData = () => {
    return data?.revenue || [];
  };

  const getPopularItems = () => {
    return data?.popularItems || [];
  };

  const getOrderStats = () => {
    return data?.orderStats || {};
  };

  const getCustomerStats = () => {
    return data?.customerStats || {};
  };

  return {
    data,
    loading,
    getRevenueData,
    getPopularItems,
    getOrderStats,
    getCustomerStats,
    refreshAnalytics: loadAnalytics
  };
};