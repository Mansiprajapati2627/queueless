import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const HomePage = () => {
  const { tableNumber } = useCart();
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Delicious Food, Zero Wait</h1>
        <p>Order from your table and enjoy</p>
        {tableNumber && <p className="table-badge">Table {tableNumber}</p>}
      </section>
      <section className="specials">
        <h2>Today's Special</h2>
        <div className="special-card">
          <h3>Grilled Salmon</h3>
          <p>Fresh Atlantic salmon with herbs</p>
          <Link to="/menu">View Menu</Link>
        </div>
      </section>
      <div className="quick-actions">
        <Link to="/menu" className="action-btn">Order Now</Link>
        <Link to="/tracking" className="action-btn">Track Order</Link>
      </div>
    </div>
  );
};

export default HomePage;