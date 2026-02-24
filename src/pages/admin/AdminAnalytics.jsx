import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { dummyOrders, dummyMenu } from '../../utils/dummyData';

const COLORS = ['#A7BFA3', '#D8B7A9', '#333333', '#5A5A5A'];

const AdminAnalytics = () => {
  // Orders per day (mock data)
  const ordersPerDay = [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 15 },
    { day: 'Wed', orders: 10 },
    { day: 'Thu', orders: 18 },
    { day: 'Fri', orders: 22 },
    { day: 'Sat', orders: 30 },
    { day: 'Sun', orders: 20 },
  ];

  // Most ordered items (mock)
  const itemCounts = dummyMenu.map(item => ({
    name: item.name,
    count: Math.floor(Math.random() * 20) + 5, // random for demo
  }));

  return (
    <div className="admin-analytics">
      <h1>Analytics</h1>
      <div className="chart-container">
        <h2>Orders per Day</h2>
        <BarChart width={600} height={300} data={ordersPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#A7BFA3" />
        </BarChart>
      </div>

      <div className="chart-container">
        <h2>Most Ordered Items</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={itemCounts}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={entry => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {itemCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default AdminAnalytics;