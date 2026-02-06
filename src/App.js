import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import UpiPaymentPage from './pages/UpiPaymentPage';
import TableScanner from './pages/TableScanner';
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('queueless_user');
    const savedTable = localStorage.getItem('queueless_table');
    const savedCart = localStorage.getItem('queueless_cart');
    const savedOrders = localStorage.getItem('queueless_orders');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTable) setTableNumber(savedTable);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const active = orders.filter(order => order.status !== 'completed');
      setActiveOrders(active);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    if (user) localStorage.setItem('queueless_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('queueless_table', tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('queueless_cart', JSON.stringify(cart));
  }, [cart]);

  // User functions
  const handleLogin = (userData) => {
    setUser(userData);
    toast.success('Login successful!');
    setShowLoginModal(false);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    toast.success('Account created successfully!');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setTableNumber(null);
    localStorage.clear();
    toast.success('Logged out successfully');
  };

  // Table functions
  const handleTableScan = (tableNum) => {
    if (tableNum >= 1 && tableNum <= 25) {
      setTableNumber(tableNum);
      toast.success(`Table ${tableNum} selected!`);
    }
  };

  // Cart functions
  const addToCart = (item, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items');
      setShowLoginModal(true);
      return false;
    }
    
    if (!tableNumber) {
      toast.error('Please scan your table QR first');
      return false;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }

    toast.success(`${item.name} added to cart!`);
    return true;
  };

  const updateQuantity = (itemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order functions
  const placeOrder = (paymentData) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const serviceCharge = subtotal * 0.02;
    const total = subtotal + tax + serviceCharge;

    const newOrder = {
      id: orderId,
      tableNumber,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      })),
      subtotal,
      tax,
      serviceCharge,
      total,
      paymentMethod: paymentData.method,
      instructions: paymentData.instructions || '',
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        message: 'Order placed successfully'
      }],
      createdAt: new Date().toISOString(),
      estimatedReadyTime: 25
    };

    // Save order
    const savedOrders = localStorage.getItem('queueless_orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('queueless_orders', JSON.stringify(orders));

    // Update active orders
    setActiveOrders(prev => [...prev, newOrder]);

    // Clear cart
    clearCart();

    toast.success(`Order placed! ID: ${orderId}`);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    const savedOrders = localStorage.getItem('queueless_orders');
    if (!savedOrders) return null;
    const orders = JSON.parse(savedOrders);
    return orders.find(order => order.id === orderId) || null;
  };

  // Protected route
  const ProtectedRoute = ({ children }) => {
    if (!user || !tableNumber) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--dark)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={
            <>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={cart.length} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
              <Home 
                user={user}
                tableNumber={tableNumber}
                cartCount={cart.length}
                activeOrdersCount={activeOrders.length}
                onShowLogin={() => setShowLoginModal(true)}
                onTableScan={handleTableScan}
              />
              <BottomNav activeOrdersCount={activeOrders.length} />
            </>
          } />
          
          <Route path="/menu" element={
            <ProtectedRoute>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={cart.length} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
              <MenuPage 
                cart={cart}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                user={user}
              />
              <BottomNav activeOrdersCount={activeOrders.length} />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={cart.length} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
              <CartPage 
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                placeOrder={placeOrder}
                user={user}
                tableNumber={tableNumber}
              />
              <BottomNav activeOrdersCount={activeOrders.length} />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={cart.length} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
              <OrderTrackingPage 
                activeOrders={activeOrders}
                getOrderById={getOrderById}
                user={user}
                tableNumber={tableNumber}
              />
              <BottomNav activeOrdersCount={activeOrders.length} />
            </ProtectedRoute>
          } />
          
          <Route path="/payment/upi" element={
            <ProtectedRoute>
              <UpiPaymentPage 
                cart={cart}
                placeOrder={placeOrder}
                user={user}
                tableNumber={tableNumber}
              />
            </ProtectedRoute>
          } />
          
          <Route path="/scan" element={
            <>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={cart.length} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
              <TableScanner 
                onScanComplete={handleTableScan}
                user={user}
              />
              <BottomNav activeOrdersCount={activeOrders.length} />
            </>
          } />
        </Routes>

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onLogout={handleLogout}
            user={user}
          />
        )}
      </div>
    </Router>
  );
}
export default App;