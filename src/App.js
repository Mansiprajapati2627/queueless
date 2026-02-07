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
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import './App.css';

// Demo users (customer only in main app)
const demoCustomers = [
  { email: 'student@college.com', password: 'password123', name: 'Student User', phone: '9876543210', role: 'customer' },
  { email: 'john@example.com', password: 'password123', name: 'John Doe', phone: '9876543211', role: 'customer' }
];

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

  // Customer authentication functions
  const handleCustomerLogin = (userData) => {
    setUser(userData);
    toast.success('Login successful!');
    setShowLoginModal(false);
  };

  const handleCustomerSignup = (userData) => {
    setUser(userData);
    toast.success('Account created successfully!');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setTableNumber(null);
    localStorage.removeItem('queueless_user');
    localStorage.removeItem('queueless_table');
    localStorage.removeItem('queueless_cart');
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
    
    if (user.role !== 'customer') {
      toast.error('Only customers can order');
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

  // Admin redirect handler
  const handleAdminRedirect = () => {
    // Redirect to static admin login page
    window.location.href = '/admin/admin-login.html';
    return null;
  };

  // Kitchen redirect handler
  const handleKitchenRedirect = () => {
    // Redirect to static kitchen page
    window.location.href = '/admin/kitchen-dashboard.html';
    return null;
  };

  // Admin dashboard redirect handler
  const handleAdminDashboardRedirect = () => {
    window.location.href = '/admin/admin-dashboard.html';
    return null;
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
          {/* Public Routes */}
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
              <BottomNav activeOrdersCount={activeOrders.length} user={user} />
            </>
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
              <BottomNav activeOrdersCount={activeOrders.length} user={user} />
            </>
          } />
          
          {/* Customer Protected Routes */}
          <Route path="/menu" element={
            <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
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
              <BottomNav activeOrdersCount={activeOrders.length} user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
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
              <BottomNav activeOrdersCount={activeOrders.length} user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
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
              <BottomNav activeOrdersCount={activeOrders.length} user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/payment/upi" element={
            <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
              <UpiPaymentPage 
                cart={cart}
                placeOrder={placeOrder}
                user={user}
                tableNumber={tableNumber}
              />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Redirect to Static HTML */}
          <Route path="/admin" element={<Navigate to="/admin/admin-login.html" replace />} />
          <Route path="/admin/login" element={handleAdminRedirect()} />
          <Route path="/admin/dashboard" element={handleAdminDashboardRedirect()} />
          <Route path="/kitchen" element={handleKitchenRedirect()} />
          <Route path="/kitchen/dashboard" element={handleKitchenRedirect()} />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Customer Login Modal */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleCustomerLogin}
            onSignup={handleCustomerSignup}
            onLogout={handleLogout}
            user={user}
            demoCustomers={demoCustomers}
          />
        )}

        {/* Hidden Admin Access Link */}
        {!user && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            <a 
              href="/admin/admin-login.html"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '10px 15px',
                borderRadius: 'var(--border-radius)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <i className="fas fa-user-shield"></i>
              Staff Login
            </a>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;