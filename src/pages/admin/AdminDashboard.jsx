import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/orderService';
import { dummyCustomers } from '../../utils/dummyData';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{dummyCustomers.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;