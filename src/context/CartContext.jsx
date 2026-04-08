import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [tableNumber, setTableNumber] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    return tableParam ? parseInt(tableParam, 10) : null;
  });
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Persist cart to localStorage whenever it changes
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

  // FIX #4: clearCart also wipes localStorage and resets table
  const clearCart = () => {
    setItems([]);
    setPaymentMethod(null);
    localStorage.removeItem('cartItems');
  };

  // FIX #4: When token disappears (logout), clear cart state + localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      // AuthContext.logout() removes 'token' AND 'cartItems'
      // This handler catches that and clears in-memory cart state too
      if (e.key === 'cartItems' && e.newValue === null) {
        setItems([]);
        setPaymentMethod(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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