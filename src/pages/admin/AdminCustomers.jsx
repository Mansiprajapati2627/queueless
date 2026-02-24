import React from 'react';
import { dummyCustomers } from '../../utils/dummyData';

const AdminCustomers = () => {
  return (
    <div className="admin-customers">
      <h1>Customers</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th></tr>
        </thead>
        <tbody>
          {dummyCustomers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.orders}</td>
              <td>${c.totalSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;