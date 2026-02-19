import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import './index.css';

// Import all components
import Icon from './components/common/Icon';
import Button from './components/common/Button';
import Card from './components/common/Card';
import Modal from './components/common/Modal';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';

// Layout Components
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import AdminLayout from './components/layout/AdminLayout';

// Customer Pages
import Home from './pages/customer/Home';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import UpiPaymentPage from './pages/customer/UpiPaymentPage';
import TableScanner from './pages/customer/TableScanner';
import ProfilePage from './pages/customer/ProfilePage';
import LoginModal from './components/common/LoginModal';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminMenu from './pages/admin/MenuManagement';
import AdminCustomers from './pages/admin/Customers';
import AdminTables from './pages/admin/Tables';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminReports from './pages/admin/Reports';

// Kitchen Pages
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import KitchenOrders from './pages/kitchen/KitchenOrders';
import KitchenSettings from './pages/kitchen/KitchenSettings';

// Demo users
const demoCustomers = [
  { email: 'student@college.com', password: 'password123', name: 'Student User', phone: '9876543210' },
  { email: 'john@example.com', password: 'password123', name: 'John Doe', phone: '9876543211' }
];

function App() {
  const [user, setUser] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data
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
          const active = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
          setActiveOrders(active);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    if (user) localStorage.setItem('queueless_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('queueless_table', tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('queueless_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth functions
  const handleCustomerLogin = useCallback((userData) => {
    const user = { ...userData, role: 'customer', id: `cust_${Date.now()}` };
    setUser(user);
    toast.success(`Welcome back, ${user.name}!`);
    setShowLoginModal(false);
  }, []);

  const handleCustomerSignup = useCallback((userData) => {
    const user = { ...userData, role: 'customer', id: `cust_${Date.now()}` };
    setUser(user);
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
    toast.success('Logged out successfully');
  }, []);

  // Table functions
  const handleTableScan = useCallback((tableNum) => {
    const num = parseInt(tableNum);
    if (num >= 1 && num <= 25) {
      setTableNumber(num);
      toast.success(`Table ${num} selected!`);
      return true;
    } else {
      toast.error('Invalid table number');
      return false;
    }
  }, []);

  // Cart functions
  const addToCart = useCallback((item, quantity = 1) => {
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
      setCart(prevCart => 
        prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
      toast.success(`Updated ${item.name} quantity`);
    } else {
      setCart(prevCart => [...prevCart, { ...item, quantity }]);
      toast.success(`${item.name} added to cart!`);
    }
    return true;
  }, [user, tableNumber, cart]);

  const updateQuantity = useCallback((itemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
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
    toast.success('Cart cleared');
  }, []);

  // Order functions
  const placeOrder = useCallback((paymentData) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const serviceCharge = subtotal * 0.02;
    const total = subtotal + tax + serviceCharge;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`,
      tableNumber,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      tax,
      serviceCharge,
      total,
      paymentMethod: paymentData.method,
      instructions: paymentData.instructions || '',
      status: 'pending',
      customerName: user?.name || 'Guest',
      customerEmail: user?.email || '',
      createdAt: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('queueless_orders', JSON.stringify(updatedOrders));

    setActiveOrders(prev => [newOrder, ...prev]);
    setCart([]);
    toast.success(`Order placed! ID: ${newOrder.id}`);
    return newOrder;
  }, [cart, user, tableNumber]);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
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
              background: '#333',
              color: 'white',
              borderRadius: '8px',
            },
          }}
        />
        
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={
            <>
              <Header 
                user={user} 
                tableNumber={tableNumber} 
                cartCount={getCartCount()} 
                onShowLogin={() => setShowLoginModal(true)}
                onLogout={handleLogout}
              />
              <Home 
                user={user}
                tableNumber={tableNumber}
                cartCount={getCartCount()}
                activeOrdersCount={activeOrders.length}
                onShowLogin={() => setShowLoginModal(true)}
                onTableScan={handleTableScan}
              />
              <BottomNav 
                activeOrdersCount={activeOrders.length} 
                cartCount={getCartCount()}
                user={user} 
              />
            </>
          } />
          
          <Route path="/scan" element={
            <>
              <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
              <TableScanner onScanComplete={handleTableScan} user={user} />
              <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
            </>
          } />
          
          <Route path="/menu" element={
            <ProtectedRoute user={user} requireTable={true}>
              <>
                <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
                <MenuPage 
                  cart={cart}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  user={user}
                  tableNumber={tableNumber}
                />
                <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute user={user} requireTable={true}>
              <>
                <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
                <CartPage 
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  placeOrder={placeOrder}
                  user={user}
                  tableNumber={tableNumber}
                  cartTotal={getCartTotal()}
                />
                <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute user={user} requireTable={true}>
              <>
                <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
                <OrderTrackingPage 
                  activeOrders={activeOrders}
                  user={user}
                  tableNumber={tableNumber}
                />
                <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/payment/upi" element={
            <ProtectedRoute user={user} requireTable={true}>
              <>
                <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
                <UpiPaymentPage 
                  cart={cart}
                  placeOrder={placeOrder}
                  user={user}
                  tableNumber={tableNumber}
                  cartTotal={getCartTotal()}
                />
                <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <>
                <Header user={user} tableNumber={tableNumber} cartCount={getCartCount()} onShowLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />
                <ProfilePage user={user} onLogout={handleLogout} />
                <BottomNav activeOrdersCount={activeOrders.length} cartCount={getCartCount()} user={user} />
              </>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <AdminProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="tables" element={<AdminTables />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Kitchen Routes */}
          <Route path="/kitchen/login" element={<AdminLogin />} />
          
          <Route path="/kitchen" element={
            <AdminProtectedRoute allowedRoles={['kitchen']}>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<KitchenDashboard />} />
            <Route path="orders" element={<KitchenOrders />} />
            <Route path="settings" element={<KitchenSettings />} />
          </Route>

          {/* Redirects */}
          <Route path="/admin/admin-login.html" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/admin-dashboard.html" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/kitchen-dashboard.html" element={<Navigate to="/kitchen" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Login Modal */}
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

        {/* Staff Login Link */}
        {!user && (
          <div className="admin-access-link">
            <a href="/admin/login" className="admin-link">
              <Icon name="user" /> Staff Login
            </a>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;