// Admin Dashboard JavaScript
let orders = [];
let notifications = [];
let adminUser = null;

// Admin Login
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Demo authentication
    if (username === 'admin' && password === 'admin123') {
        adminUser = {
            id: 1,
            name: 'Administrator',
            role: 'Super Admin',
            email: 'admin@queueless.com'
        };
        
        localStorage.setItem('queueless_admin', JSON.stringify(adminUser));
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials. Use admin/admin123 for demo.');
    }
}

// Check admin authentication
function checkAuth() {
    const savedAdmin = localStorage.getItem('queueless_admin');
    if (!savedAdmin && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (savedAdmin) {
        adminUser = JSON.parse(savedAdmin);
        updateAdminInfo();
    }
}

// Update admin info display
function updateAdminInfo() {
    if (adminUser) {
        document.getElementById('adminName').textContent = adminUser.name;
        document.getElementById('adminRole').textContent = adminUser.role;
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('queueless_admin');
        window.location.href = 'login.html';
    }
}

// Load sample data
function loadSampleData() {
    // Sample orders data
    orders = [
        {
            id: 1001,
            table: 12,
            customer: 'John Doe',
            items: [
                { name: 'Paneer Tikka', quantity: 2, price: 280 },
                { name: 'Garlic Naan', quantity: 4, price: 50 }
            ],
            total: 760,
            status: 'pending',
            payment: 'upi',
            timestamp: new Date().toISOString(),
            estimatedTime: '15 min'
        },
        {
            id: 1002,
            table: 8,
            customer: 'Jane Smith',
            items: [
                { name: 'Chicken Biryani', quantity: 1, price: 350 },
                { name: 'Coke', quantity: 2, price: 60 }
            ],
            total: 470,
            status: 'preparing',
            payment: 'card',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            estimatedTime: '10 min'
        },
        {
            id: 1003,
            table: 5,
            customer: 'Robert Johnson',
            items: [
                { name: 'Veg Pizza', quantity: 1, price: 300 },
                { name: 'Garlic Bread', quantity: 1, price: 150 }
            ],
            total: 450,
            status: 'ready',
            payment: 'cash',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            estimatedTime: '0 min'
        },
        {
            id: 1004,
            table: 15,
            customer: 'Sarah Williams',
            items: [
                { name: 'Butter Chicken', quantity: 2, price: 380 },
                { name: 'Butter Naan', quantity: 4, price: 50 }
            ],
            total: 960,
            status: 'completed',
            payment: 'upi',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            completionTime: new Date(Date.now() - 900000).toISOString()
        }
    ];
    
    // Sample notifications
    notifications = [
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'Table 12 placed an order for ₹760',
            time: '2 min ago',
            read: false
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            message: 'Table 8 paid ₹470 via Card',
            time: '5 min ago',
            read: false
        },
        {
            id: 3,
            type: 'alert',
            title: 'Low Stock Alert',
            message: 'Paneer is running low',
            time: '1 hour ago',
            read: true
        }
    ];
    
    // Sample top items
    const topItems = [
        { name: 'Paneer Tikka', sales: 48, revenue: 13440 },
        { name: 'Chicken Biryani', sales: 36, revenue: 12600 },
        { name: 'Butter Chicken', sales: 32, revenue: 12160 },
        { name: 'Veg Pizza', sales: 28, revenue: 8400 },
        { name: 'Cold Coffee', sales: 56, revenue: 6720 }
    ];
    
    localStorage.setItem('queueless_admin_orders', JSON.stringify(orders));
    localStorage.setItem('queueless_admin_notifications', JSON.stringify(notifications));
    localStorage.setItem('queueless_admin_top_items', JSON.stringify(topItems));
}

// Update dashboard data
function updateDashboard() {
    const orders = JSON.parse(localStorage.getItem('queueless_admin_orders') || '[]');
    const topItems = JSON.parse(localStorage.getItem('queueless_admin_top_items') || '[]');
    
    // Update counts
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const preparingOrders = orders.filter(o => o.status === 'preparing').length;
    const readyOrders = orders.filter(o => o.status === 'ready').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Calculate today's revenue
    const today = new Date().toDateString();
    const todayRevenue = orders
        .filter(o => new Date(o.timestamp).toDateString() === today && o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('todayRevenue').textContent = `₹${todayRevenue}`;
    
    // Update recent orders table
    updateRecentOrders(orders.slice(0, 5));
    
    // Update top items list
    updateTopItems(topItems.slice(0, 5));
    
    // Update notification count
    updateNotificationCount();
    
    // Update date time
    updateDateTime();
}

function updateRecentOrders(recentOrders) {
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.table}</td>
            <td>₹${order.total}</td>
            <td><span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></td>
            <td>${formatTime(order.timestamp)}</td>
            <td>
                <button class="btn-view" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateTopItems(topItems) {
    const container = document.getElementById('topItemsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    topItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'top-item';
        itemElement.innerHTML = `
            <span class="item-rank">${index + 1}</span>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.sales} orders • ₹${item.revenue}</p>
            </div>
            <span class="item-percentage">${Math.round((item.sales / 100) * 100)}%</span>
        `;
        container.appendChild(itemElement);
    });
}

function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    document.getElementById('notificationCount').textContent = unreadCount;
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
}

// Order Management Functions
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    content.innerHTML = `
        <div class="order-details">
            <div class="detail-row">
                <span>Order ID:</span>
                <strong>#${order.id}</strong>
            </div>
            <div class="detail-row">
                <span>Table:</span>
                <strong>${order.table}</strong>
            </div>
            <div class="detail-row">
                <span>Customer:</span>
                <strong>${order.customer}</strong>
            </div>
            <div class="detail-row">
                <span>Order Time:</span>
                <strong>${formatTime(order.timestamp)}</strong>
            </div>
            <div class="detail-row">
                <span>Payment:</span>
                <strong>${order.payment.toUpperCase()}</strong>
            </div>
            <div class="detail-row">
                <span>Status:</span>
                <select id="orderStatusSelect">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready to Serve</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            
            <h3>Order Items:</h3>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                <span>Total Amount:</span>
                <strong>₹${order.total}</strong>
            </div>
            
            <div class="customer-notification">
                <label>
                    <input type="checkbox" id="sendNotification" checked>
                    Send notification to customer
                </label>
                <textarea id="notificationMessage" placeholder="Custom message (optional)">Your order status has been updated to: ${order.status}</textarea>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function updateOrderStatus() {
    const orderId = parseInt(prompt('Enter Order ID to update:'));
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found!');
        return;
    }
    
    const newStatus = prompt('Enter new status (pending/preparing/ready/completed/cancelled):');
    if (['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(newStatus)) {
        order.status = newStatus;
        
        if (newStatus === 'completed') {
            order.completionTime = new Date().toISOString();
        }
        
        // Send notification to customer
        sendCustomerNotification(order, newStatus);
        
        // Update local storage
        localStorage.setItem('queueless_admin_orders', JSON.stringify(orders));
        
        // Add admin notification
        addNotification({
            type: 'order',
            title: 'Order Status Updated',
            message: `Order #${orderId} updated to ${newStatus}`,
            time: 'Just now'
        });
        
        alert(`Order #${orderId} status updated to ${newStatus}`);
        updateDashboard();
    } else {
        alert('Invalid status!');
    }
}

function sendCustomerNotification(order, newStatus) {
    // In a real application, this would send a push notification or SMS
    console.log(`Sending notification to customer at Table ${order.table}: Order #${order.id} is now ${newStatus}`);
    
    // Simulate sending notification
    const notification = {
        orderId: order.id,
        table: order.table,
        status: newStatus,
        message: `Your order #${order.id} is now ${newStatus}`,
        timestamp: new Date().toISOString()
    };
    
    // Store for customer to see (simulated)
    const customerNotifications = JSON.parse(localStorage.getItem('queueless_customer_notifications') || '[]');
    customerNotifications.push(notification);
    localStorage.setItem('queueless_customer_notifications', JSON.stringify(customerNotifications));
}

function addNotification(notification) {
    notification.id = notifications.length + 1;
    notification.read = false;
    notification.time = 'Just now';
    notifications.unshift(notification);
    
    localStorage.setItem('queueless_admin_notifications', JSON.stringify(notifications));
    updateNotificationCount();
}

// Notifications Panel
function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    
    if (panel.style.display === 'block') {
        loadNotifications();
    }
}

function loadNotifications() {
    const container = document.getElementById('notificationsList');
    container.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
        notificationElement.onclick = () => markAsRead(notification.id);
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        `;
        
        container.appendChild(notificationElement);
    });
}

function getNotificationIcon(type) {
    const icons = {
        order: 'shopping-cart',
        payment: 'credit-card',
        alert: 'exclamation-triangle',
        system: 'cog'
    };
    return icons[type] || 'bell';
}

function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('queueless_admin_notifications', JSON.stringify(notifications));
        updateNotificationCount();
        loadNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    localStorage.setItem('queueless_admin_notifications', JSON.stringify(notifications));
    updateNotificationCount();
    loadNotifications();
}

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function syncData() {
    // Simulate data sync
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
    btn.disabled = true;
    
    setTimeout(() => {
        loadSampleData();
        updateDashboard();
        initCharts();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showAlert('Data synced successfully!', 'success');
    }, 1500);
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    if (window.location.href.includes('index.html')) {
        loadSampleData();
        updateDashboard();
        initCharts();
        
        // Update dashboard every 30 seconds
        setInterval(updateDashboard, 30000);
        setInterval(updateDateTime, 60000);
    }
    
    // Close notifications panel when clicking outside
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('notificationsPanel');
        const bell = document.querySelector('.notification-bell');
        
        if (panel && panel.style.display === 'block' && 
            !panel.contains(event.target) && 
            !bell.contains(event.target)) {
            panel.style.display = 'none';
        }
    });
});