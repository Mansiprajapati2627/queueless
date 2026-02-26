import React, { useState } from 'react';
import { dummyCustomers } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/helpers';
import { Search, Users, ShoppingBag, TrendingUp } from 'lucide-react';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, orders, spent

  const filteredCustomers = dummyCustomers
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'orders') return b.orders - a.orders;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      return 0;
    });

  const totalCustomers = dummyCustomers.length;
  const totalOrders = dummyCustomers.reduce((sum, c) => sum + c.orders, 0);
  const totalRevenue = dummyCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="admin-customers">
      <div className="customers-header">
        <h1>Customers</h1>
        <div className="customers-stats">
          <div className="stat">
            <Users size={20} />
            <span>{totalCustomers} Total</span>
          </div>
          <div className="stat">
            <ShoppingBag size={20} />
            <span>{totalOrders} Orders</span>
          </div>
          <div className="stat">
            <TrendingUp size={20} />
            <span>{formatCurrency(avgOrderValue)} Avg</span>
          </div>
        </div>
      </div>

      <div className="customers-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="orders">Orders</option>
            <option value="spent">Total Spent</option>
          </select>
        </div>
      </div>

      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="customer-name">{customer.name}</td>
                  <td>{customer.email}</td>
                  <td className="orders-count">{customer.orders}</td>
                  <td className="spent-amount">{formatCurrency(customer.totalSpent)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;