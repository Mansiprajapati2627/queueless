import React, { useState } from "react";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Paneer Tikka", price: 280, stock: 50 },
    { id: 2, name: "Chicken Biryani", price: 350, stock: 30 },
  ]);

  const toggleStock = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id
          ? { ...item, stock: item.stock > 0 ? 0 : 50 }
          : item
      )
    );
  };

  return (
    <div>
      <h1>Menu Management</h1>

      {menuItems.map((item) => (
        <div key={item.id} className="menu-card">
          <h3>{item.name}</h3>
          <p>₹{item.price}</p>
          <p>Stock: {item.stock}</p>

          <button onClick={() => toggleStock(item.id)}>
            Toggle Stock
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminMenu;