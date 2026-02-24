import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [tableNumber, setTableNumber] = useState(null);
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Load from localStorage on mount (optional)
  useEffect(() => {
    const savedTable = localStorage.getItem('tableNumber');
    if (savedTable) setTableNumber(Number(savedTable));
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('tableNumber', tableNumber);
    else localStorage.removeItem('tableNumber');
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === menuItem.id);
      if (existing) {
        return prev.map(i => i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => {
    setItems([]);
    setPaymentMethod(null);
  };

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }, [items]);

  const value = useMemo(() => ({
    tableNumber,
    setTableNumber,
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    paymentMethod,
    setPaymentMethod,
    isTableSelected: !!tableNumber,
  }), [tableNumber, items, total, paymentMethod]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);