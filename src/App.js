import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Create redirect components (FIX FOR FLICKERING)
const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = '/admin/admin-login.html';
  }, []);
  return (
    <div className="redirect-screen">
      <p>Redirecting to Admin Login...</p>
    </div>
  );
};

const KitchenRedirect = () => {
  useEffect(() => {
    window.location.href = '/admin/kitchen-dashboard.html';
  }, []);
  return (
    <div className="redirect-screen">
      <p>Redirecting to Kitchen Dashboard...</p>
    </div>
  );
};

const AdminDashboardRedirect = () => {
  useEffect(() => {
    window.location.href = '/admin/admin-dashboard.html';
  }, []);
  return (
    <div className="redirect-screen">
      <p>Redirecting to Admin Dashboard...</p>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from localStorage in a single effect
  useEffect(() => {
    const loadData = () => {
      try {
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
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('queueless_user');
        localStorage.removeItem('queueless_table');
        localStorage.removeItem('queueless_cart');
        localStorage.removeItem('queueless_orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save all data when any relevant state changes
  useEffect(() => {
    if (!isLoading) {
      const saveData = () => {
        try {
          if (user) {
            localStorage.setItem('queueless_user', JSON.stringify(user));
          } else {
            localStorage.removeItem('queueless_user');
          }
          
          if (tableNumber) {
            localStorage.setItem('queueless_table', tableNumber);
          } else {
            localStorage.removeItem('queueless_table');
          }
          
          localStorage.setItem('queueless_cart', JSON.stringify(cart));
        } catch (error) {
          console.error('Error saving data to localStorage:', error);
        }
      };

      // Use setTimeout to batch updates
      const timer = setTimeout(saveData, 100);
      return () => clearTimeout(timer);
    }
  }, [user, tableNumber, cart, isLoading]);

  // Save orders separately when they change
  useEffect(() => {
    if (!isLoading) {
      const saveOrders = () => {
        try {
          // Load existing orders first
          const savedOrders = localStorage.getItem('queueless_orders');
          const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];
          
          // Filter out completed orders from activeOrders and merge with existing
          const completedOrders = existingOrders.filter(order => order.status === 'completed');
          const allOrders = [...activeOrders, ...completedOrders];
          
          // Save only if there are changes
          if (JSON.stringify(allOrders) !== JSON.stringify(existingOrders)) {
            localStorage.setItem('queueless_orders', JSON.stringify(allOrders));
          }
        } catch (error) {
          console.error('Error saving orders to localStorage:', error);
        }
      };

      const timer = setTimeout(saveOrders, 100);
      return () => clearTimeout(timer);
    }
  }, [activeOrders, isLoading]);

  // Customer authentication functions
  const handleCustomerLogin = useCallback((userData) => {
    setUser(userData);
    toast.success('Login successful!');
    setShowLoginModal(false);
  }, []);

  const handleCustomerSignup = useCallback((userData) => {
    setUser(userData);
    toast.success('Account created successfully!');
    setShowLoginModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCart([]);
    setTableNumber(null);
    setActiveOrders([]);
    localStorage.removeItem('queueless_user');
    localStorage.removeItem('queueless_table');
    localStorage.removeItem('queueless_cart');
    localStorage.removeItem('queueless_orders');
    toast.success('Logged out successfully');
  }, []);

  // Table functions
  const handleTableScan = useCallback((tableNum) => {
    if (tableNum >= 1 && tableNum <= 25) {
      setTableNumber(tableNum);
      toast.success(`Table ${tableNum} selected!`);
    } else {
      toast.error('Invalid table number. Please scan a valid QR code.');
    }
  }, []);

  // Cart functions
  const addToCart = useCallback((item, quantity = 1) => {
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

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });

    toast.success(`${item.name} added to cart!`);
    return true;
  }, [user, tableNumber]);

  const updateQuantity = useCallback((itemId, change) => {
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
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Order functions
  const placeOrder = useCallback((paymentData) => {
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
      estimatedReadyTime: 25,
      customerName: user?.name || 'Guest',
      customerEmail: user?.email || ''
    };

    // Update active orders
    setActiveOrders(prev => [...prev, newOrder]);

    // Clear cart
    clearCart();

    toast.success(`Order placed! ID: ${orderId}`);
    return newOrder;
  }, [cart, tableNumber, user, clearCart]);

  const getOrderById = useCallback((orderId) => {
    // Check active orders first
    const activeOrder = activeOrders.find(order => order.id === orderId);
    if (activeOrder) return activeOrder;
    
    // Check localStorage for completed orders
    try {
      const savedOrders = localStorage.getItem('queueless_orders');
      if (!savedOrders) return null;
      const orders = JSON.parse(savedOrders);
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }, [activeOrders]);

  // Memoize props that are passed to child components
  const headerProps = useMemo(() => ({
    user,
    tableNumber,
    cartCount: cart.length,
    onShowLogin: () => setShowLoginModal(true),
    onLogout: handleLogout
  }), [user, tableNumber, cart.length, handleLogout]);

  const bottomNavProps = useMemo(() => ({
    activeOrdersCount: activeOrders.length,
    user
  }), [activeOrders.length, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Queueless...</p>
      </div>
    );
  }

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
        
        {/* Always render Header and BottomNav to prevent remounting */}
        <Header {...headerProps} />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Home 
                user={user}
                tableNumber={tableNumber}
                cartCount={cart.length}
                activeOrdersCount={activeOrders.length}
                onShowLogin={() => setShowLoginModal(true)}
                onTableScan={handleTableScan}
              />
            } />
            
            <Route path="/scan" element={
              <TableScanner 
                onScanComplete={handleTableScan}
                user={user}
              />
            } />
            
            {/* Customer Protected Routes */}
            <Route path="/menu" element={
              <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
                <MenuPage 
                  cart={cart}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  user={user}
                  tableNumber={tableNumber}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/cart" element={
              <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
                <CartPage 
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  placeOrder={placeOrder}
                  user={user}
                  tableNumber={tableNumber}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute user={user} allowedRoles={['customer']} requireTable={true}>
                <OrderTrackingPage 
                  activeOrders={activeOrders}
                  getOrderById={getOrderById}
                  user={user}
                  tableNumber={tableNumber}
                />
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
            
            {/* Admin Routes - FIXED: Use components instead of function calls */}
            <Route path="/admin" element={<Navigate to="/admin/admin-login.html" replace />} />
            <Route path="/admin/login" element={<AdminRedirect />} />
            <Route path="/admin/dashboard" element={<AdminDashboardRedirect />} />
            <Route path="/kitchen" element={<KitchenRedirect />} />
            <Route path="/kitchen/dashboard" element={<KitchenRedirect />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <BottomNav {...bottomNavProps} />

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
          <div className="admin-access-link">
            <a 
              href="/admin/admin-login.html"
              className="admin-link"
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