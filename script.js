
// Replace the entire script.js with this updated version

// Initialize variables
let currentTable = null;
let currentUser = null;
let cart = [];
let menuItems = [];
let isLoggedIn = false;
let activeOrders = [];
let orderHistory = [];
let orderUpdateInterval = null;

// Order status definitions
const ORDER_STATUS = {
    PENDING: { id: 'pending', label: 'Order Placed', icon: 'fa-clock', color: '#ff9800' },
    CONFIRMED: { id: 'confirmed', label: 'Order Confirmed', icon: 'fa-check', color: '#2196f3' },
    PREPARING: { id: 'preparing', label: 'Food Preparing', icon: 'fa-utensils', color: '#4CAF50' },
    READY: { id: 'ready', label: 'Ready to Serve', icon: 'fa-check-circle', color: '#8BC34A' },
    SERVED: { id: 'served', label: 'Served', icon: 'fa-concierge-bell', color: '#673ab7' },
    COMPLETED: { id: 'completed', label: 'Completed', icon: 'fa-flag-checkered', color: '#9e9e9e' }
};

// Menu Data
const menuData = [
    {
        id: 1,
        name: "Paneer Tikka",
        description: "Grilled cottage cheese cubes with spices",
        price: 280,
        category: "veg",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Chicken Biryani",
        description: "Fragrant rice with spicy chicken",
        price: 350,
        category: "nonveg",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Veg Burger",
        description: "Fresh vegetables with special sauce",
        price: 180,
        category: "veg",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Chicken Burger",
        description: "Juicy chicken patty with lettuce",
        price: 220,
        category: "nonveg",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Cold Coffee",
        description: "Iced coffee with cream",
        price: 120,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie with ice cream",
        price: 150,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&h=300&fit=crop"
    },
    {
        id: 7,
        name: "Pizza Margherita",
        description: "Classic pizza with tomato and cheese",
        price: 300,
        category: "veg",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
    },
    {
        id: 8,
        name: "Lemonade",
        description: "Fresh lemon juice with mint",
        price: 80,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1621264968373-430b60e8af3b?w=400&h=300&fit=crop"
    }
];

// DOM Elements
const qrScannerModal = document.getElementById('qrScannerModal');
const loginModal = document.getElementById('loginModal');
const tableDisplay = document.getElementById('tableDisplay');
const userName = document.getElementById('userName');
const cartCount = document.getElementById('cartCount');
const menuItemsContainer = document.getElementById('menuItems');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const quickCartCount = document.getElementById('quickCartCount');
const quickCartTotal = document.getElementById('quickCartTotal');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    const savedUser = localStorage.getItem('queueless_user');
    const savedTable = localStorage.getItem('queueless_table');
    const savedCart = localStorage.getItem('queueless_cart');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUserDisplay();
    }
    
    if (savedTable) {
        currentTable = savedTable;
        updateTableDisplay();
    }
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
    
    // Load menu
    loadMenu();
    
    // Initialize order tracking
    initOrderTracking();
    
    // Show QR scanner if no table is set
    if (!currentTable) {
        setTimeout(() => {
            openQRScanner();
        }, 500);
    }
});

// QR Scanner Functions
function openQRScanner() {
    qrScannerModal.style.display = 'flex';
    
    // Initialize QR Scanner
    const html5QrCode = new Html5Qrcode("qr-reader");
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText.includes("table=")) {
            const tableNum = decodedText.split("table=")[1];
            setTable(tableNum);
            html5QrCode.stop();
            qrScannerModal.style.display = 'none';
        }
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback
    ).catch(err => {
        console.error("QR Scanner error:", err);
    });
}

function setTableNumber() {
    const tableNum = document.getElementById('tableNumberInput').value;
    if (tableNum && tableNum > 0 && tableNum <= 25) {
        setTable(tableNum);
        qrScannerModal.style.display = 'none';
    } else {
        alert("Please enter a valid table number (1-25)");
    }
}

function setTable(tableNum) {
    currentTable = tableNum;
    localStorage.setItem('queueless_table', tableNum);
    updateTableDisplay();
    
    // Show login modal after 2 seconds if not logged in
    setTimeout(() => {
        if (!isLoggedIn) {
            openLoginModal();
        }
    }, 2000);
}

function updateTableDisplay() {
    if (currentTable) {
        if (tableDisplay) tableDisplay.textContent = `Table: ${currentTable}`;
    }
}

// Login Functions
function openLoginModal() {
    if (loginModal) loginModal.style.display = 'flex';
}

function closeLoginModal() {
    if (loginModal) loginModal.style.display = 'none';
}

function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show current tab
    document.getElementById(tabName).classList.add('active');
    
    // Set active button
    event.target.classList.add('active');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }
    
    // Demo credentials check
    if (email === "user@example.com" && password === "password123") {
        currentUser = {
            name: "John Doe",
            email: email,
            phone: "9876543210"
        };
    } else {
        // For other users, just accept any valid email
        currentUser = {
            name: email.split('@')[0],
            email: email,
            phone: "0000000000"
        };
    }
    
    isLoggedIn = true;
    localStorage.setItem('queueless_user', JSON.stringify(currentUser));
    updateUserDisplay();
    closeLoginModal();
    
    // Enable add to cart buttons
    enableAddToCartButtons();
    
    showNotification("Login successful!");
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    }
    
    // Simulate signup
    currentUser = {
        name: name,
        email: email,
        phone: phone
    };
    
    isLoggedIn = true;
    localStorage.setItem('queueless_user', JSON.stringify(currentUser));
    updateUserDisplay();
    closeLoginModal();
    
    // Enable add to cart buttons
    enableAddToCartButtons();
    
    showNotification("Signup successful! You can now order.");
}

function updateUserDisplay() {
    if (currentUser && userName) {
        userName.textContent = currentUser.name;
    }
}

// Menu Functions
function loadMenu() {
    menuItems = menuData;
    renderMenuItems(menuItems);
}

function renderMenuItems(items) {
    if (!menuItemsContainer) return;
    
    menuItemsContainer.innerHTML = '';
    
    items.forEach(item => {
        const existingCartItem = cart.find(cartItem => cartItem.id === item.id);
        const quantity = existingCartItem ? existingCartItem.quantity : 0;
        
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.setAttribute('data-id', item.id);
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="item-details">
                <div class="item-header">
                    <h3 class="item-name">${item.name}</h3>
                    <span class="item-price">₹${item.price}</span>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-category ${item.category}">${item.category.toUpperCase()}</span>
                    ${quantity === 0 ? `
                        <button class="add-to-cart ${!isLoggedIn || !currentTable ? 'disabled' : ''}" 
                                onclick="addToCart(${item.id})"
                                ${!isLoggedIn || !currentTable ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    ` : `
                        <div class="quantity-control" style="display: flex; align-items: center; gap: 10px; background: #f8f9ff; padding: 5px 15px; border-radius: 20px;">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1, true)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1, true)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItem);
    });
}

function filterCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        renderMenuItems(menuItems);
    } else {
        const filteredItems = menuItems.filter(item => item.category === category);
        renderMenuItems(filteredItems);
    }
}

// Enable add to cart buttons
function enableAddToCartButtons() {
    document.querySelectorAll('.add-to-cart.disabled').forEach(btn => {
        btn.classList.remove('disabled');
        btn.disabled = false;
    });
}

// Cart Functions
function addToCart(itemId, fromMenu = true) {
    if (!isLoggedIn) {
        alert("Please login to add items to cart");
        openLoginModal();
        return;
    }
    
    if (!currentTable) {
        alert("Please scan a table QR code first");
        openQRScanner();
        return;
    }
    
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartNotification();
    
    // Update menu item display if adding from menu
    if (fromMenu) {
        updateMenuItemDisplay(itemId);
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateMenuItemDisplay(itemId);
}

function updateQuantity(itemId, change, fromMenu = false) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
            if (fromMenu) {
                updateMenuItemDisplay(itemId);
            }
        }
    }
}

// Update specific menu item display
function updateMenuItemDisplay(itemId) {
    const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (!menuItem) return;
    
    const existingCartItem = cart.find(cartItem => cartItem.id === itemId);
    const quantity = existingCartItem ? existingCartItem.quantity : 0;
    
    const itemFooter = menuItem.querySelector('.item-footer');
    if (itemFooter) {
        if (quantity === 0) {
            itemFooter.innerHTML = `
                <span class="item-category ${menuItems.find(i => i.id === itemId)?.category}">
                    ${menuItems.find(i => i.id === itemId)?.category.toUpperCase()}
                </span>
                <button class="add-to-cart" onclick="addToCart(${itemId})">
                    <i class="fas fa-plus"></i>
                </button>
            `;
        } else {
            itemFooter.innerHTML = `
                <span class="item-category ${menuItems.find(i => i.id === itemId)?.category}">
                    ${menuItems.find(i => i.id === itemId)?.category.toUpperCase()}
                </span>
                <div class="quantity-control" style="display: flex; align-items: center; gap: 10px; background: #f8f9ff; padding: 5px 15px; border-radius: 20px;">
                    <button class="qty-btn" onclick="updateQuantity(${itemId}, -1, true)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${itemId}, 1, true)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
        }
    }
}

function updateCartDisplay() {
    // Save cart to localStorage
    localStorage.setItem('queueless_cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (quickCartCount) quickCartCount.textContent = totalItems;
    
    // Update cart total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (quickCartTotal) quickCartTotal.textContent = totalAmount;
    
    // Show cart notification
    showCartNotification();
}

function showCartNotification() {
    // Add a subtle animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
}

// Order Tracking Functions
function initOrderTracking() {
    // Load saved orders
    const savedOrders = localStorage.getItem('queueless_orders');
    if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        orders.forEach(order => {
            if (order.status !== 'completed') {
                activeOrders.push(order);
            } else {
                orderHistory.push(order);
            }
        });
    }
    
    // Start order updates simulation
    startOrderUpdates();
    updateActiveOrdersBadge();
}

function createOrder(paymentData) {
    const orderId = generateOrderId();
    const tableNumber = localStorage.getItem('queueless_table');
    const cart = JSON.parse(localStorage.getItem('queueless_cart') || '[]');
    
    const order = {
        id: orderId,
        tableNumber: tableNumber,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category
        })),
        total: paymentData.amount,
        subtotal: calculateSubtotal(cart),
        tax: calculateTax(cart),
        serviceCharge: calculateServiceCharge(cart),
        paymentMethod: paymentData.method,
        status: ORDER_STATUS.PENDING.id,
        statusHistory: [{
            status: ORDER_STATUS.PENDING.id,
            timestamp: new Date().toISOString(),
            message: 'Order placed successfully'
        }],
        createdAt: new Date().toISOString(),
        estimatedReadyTime: calculateEstimatedTime(cart),
        instructions: paymentData.instructions || ''
    };
    
    // Save order
    activeOrders.push(order);
    saveOrders();
    
    // Start tracking this order
    startTrackingOrder(order);
    
    return order;
}

function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
}

function calculateSubtotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTax(cart) {
    return calculateSubtotal(cart) * 0.05;
}

function calculateServiceCharge(cart) {
    return calculateSubtotal(cart) * 0.02;
}

function calculateEstimatedTime(cart) {
    const baseTime = 15;
    const itemTime = cart.reduce((total, item) => {
        switch(item.category) {
            case 'appetizers': return total + 5;
            case 'maincourse': return total + 15;
            case 'desserts': return total + 10;
            default: return total + 8;
        }
    }, 0);
    
    return Math.min(baseTime + itemTime, 45);
}

function startTrackingOrder(order) {
    // Simulate order progress
    setTimeout(() => updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED.id), 30000);
    setTimeout(() => updateOrderStatus(order.id, ORDER_STATUS.PREPARING.id), 60000);
    setTimeout(() => updateOrderStatus(order.id, ORDER_STATUS.READY.id), calculateReadyTime(order));
    setTimeout(() => updateOrderStatus(order.id, ORDER_STATUS.SERVED.id), calculateReadyTime(order) + 300000);
    setTimeout(() => completeOrder(order.id), calculateReadyTime(order) + 600000);
}

function calculateReadyTime(order) {
    return order.estimatedReadyTime * 60000; // Convert minutes to milliseconds
}

function updateOrderStatus(orderId, newStatus) {
    const order = activeOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            message: getStatusMessage(newStatus)
        });
        
        saveOrders();
        updateOrdersDisplay();
        showStatusNotification(orderId, newStatus);
    }
}

function getStatusMessage(status) {
    const messages = {
        'pending': 'We have received your order',
        'confirmed': 'Restaurant has confirmed your order',
        'preparing': 'Chef is preparing your food',
        'ready': 'Your order is ready for serving',
        'served': 'Order has been served at your table',
        'completed': 'Order completed successfully'
    };
    return messages[status] || 'Order status updated';
}

function completeOrder(orderId) {
    const orderIndex = activeOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        const order = activeOrders[orderIndex];
        order.status = ORDER_STATUS.COMPLETED.id;
        order.completedAt = new Date().toISOString();
        
        activeOrders.splice(orderIndex, 1);
        orderHistory.unshift(order);
        
        saveOrders();
        updateOrdersDisplay();
    }
}

function saveOrders() {
    const allOrders = [...activeOrders, ...orderHistory];
    localStorage.setItem('queueless_orders', JSON.stringify(allOrders));
    updateActiveOrdersBadge();
}

function updateActiveOrdersBadge() {
    const badge = document.getElementById('activeOrdersBadge');
    if (badge) {
        badge.textContent = activeOrders.length;
        badge.style.display = activeOrders.length > 0 ? 'flex' : 'none';
    }
}

function showOrderConfirmation(order) {
    const modalHTML = `
        <div class="modal" id="orderConfirmationModal">
            <div class="modal-content">
                <div style="text-align: center; padding: 40px 20px;">
                    <div class="success-icon" style="font-size: 60px; color: #4CAF50; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p style="color: #666; margin: 15px 0;">Your order has been placed successfully</p>
                    
                    <div style="background: #f8f9ff; padding: 20px; border-radius: 15px; margin: 20px 0;">
                        <div style="font-family: monospace; background: #667eea; color: white; padding: 10px; border-radius: 10px; margin-bottom: 10px; font-size: 18px;">
                            ${order.id}
                        </div>
                        <p><i class="fas fa-chair"></i> Table ${order.tableNumber}</p>
                        <p><i class="fas fa-clock"></i> Estimated wait: ${order.estimatedReadyTime} minutes</p>
                        <p><i class="fas fa-rupee-sign"></i> Total: ₹${order.total}</p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="btn-secondary" onclick="trackOrderAfterConfirmation('${order.id}')">
                            <i class="fas fa-map-marker-alt"></i> Track Order
                        </button>
                        <button class="btn-primary" onclick="continueOrdering()">
                            <i class="fas fa-utensils"></i> Continue Ordering
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        document.getElementById('orderConfirmationModal').style.display = 'flex';
    }, 10);
}

function trackOrderAfterConfirmation(orderId) {
    closeModal();
    if (window.location.pathname.includes('index.html')) {
        showActiveOrders();
        setTimeout(() => showOrderTracking(orderId), 100);
    } else {
        window.location.href = 'index.html';
        // Store order ID to track after page loads
        localStorage.setItem('track_order_id', orderId);
    }
}

function continueOrdering() {
    closeModal();
    // Clear cart but keep user logged in
    cart = [];
    localStorage.removeItem('queueless_cart');
    updateCartDisplay();
    
    // Reload menu to reset quantities
    loadMenu();
}

function startOrderUpdates() {
    if (orderUpdateInterval) {
        clearInterval(orderUpdateInterval);
    }
    
    orderUpdateInterval = setInterval(() => {
        activeOrders.forEach(order => {
            if (order.status !== 'completed') {
                if (Math.random() > 0.7) {
                    const currentStatusIndex = Object.values(ORDER_STATUS).findIndex(s => s.id === order.status);
                    if (currentStatusIndex < Object.values(ORDER_STATUS).length - 1) {
                        const nextStatus = Object.values(ORDER_STATUS)[currentStatusIndex + 1];
                        updateOrderStatus(order.id, nextStatus.id);
                    }
                }
            }
        });
    }, 30000);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function showStatusNotification(orderId, newStatus) {
    const status = ORDER_STATUS[newStatus.toUpperCase()] || ORDER_STATUS.PENDING;
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas ${status.icon}" style="color: ${status.color}; font-size: 20px;"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600;">Order ${orderId}</div>
            <div style="font-size: 13px; color: #666;">${status.label}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #999; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
}

// Navigation Functions
function showMenu() {
    const menuSection = document.getElementById('menuSection');
    const ordersSection = document.getElementById('ordersSection');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    if (menuSection && ordersSection) {
        menuSection.style.display = 'block';
        ordersSection.style.display = 'none';
        navBtns[0].classList.add('active');
        navBtns[1].classList.remove('active');
    }
}

function showActiveOrders() {
    const menuSection = document.getElementById('menuSection');
    const ordersSection = document.getElementById('ordersSection');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    if (menuSection && ordersSection) {
        menuSection.style.display = 'none';
        ordersSection.style.display = 'block';
        navBtns[0].classList.remove('active');
        navBtns[1].classList.add('active');
        loadOrders();
    }
}

function loadOrders() {
    const savedOrders = localStorage.getItem('queueless_orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    
    activeOrders = orders.filter(order => order.status !== 'completed');
    orderHistory = orders.filter(order => order.status === 'completed');
    
    updateOrdersDisplay();
}

function updateOrdersDisplay() {
    const activeOrdersContainer = document.getElementById('activeOrders');
    const orderHistoryContainer = document.getElementById('orderHistory');
    
    if (!activeOrdersContainer || !orderHistoryContainer) return;
    
    if (activeOrders.length === 0) {
        activeOrdersContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-clock"></i>
                <h3>No Active Orders</h3>
                <p>You don't have any active orders right now.</p>
                <button class="btn-primary" onclick="showMenu()">
                    <i class="fas fa-utensils"></i> Browse Menu
                </button>
            </div>
        `;
    } else {
        activeOrdersContainer.innerHTML = activeOrders.map(order => createOrderCard(order)).join('');
    }
    
    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-history"></i>
                <h3>No Order History</h3>
                <p>Your completed orders will appear here.</p>
            </div>
        `;
    } else {
        orderHistoryContainer.innerHTML = orderHistory.map(order => createOrderCard(order)).join('');
    }
    
    // Add event listeners
    document.querySelectorAll('.btn-track').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderTracking(orderId);
        });
    });
    
    document.querySelectorAll('.btn-reorder').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            reorderItems(orderId);
        });
    });
}

function createOrderCard(order) {
    const status = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
    const orderTime = new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">${order.id}</div>
                    <div class="order-time">${orderDate} ${orderTime} • Table ${order.tableNumber}</div>
                </div>
                <span class="order-status status-${order.status}">
                    <i class="fas ${status.icon}"></i> ${status.label}
                </span>
            </div>
            
            <div class="order-items">
                ${order.items.slice(0, 3).map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `
                    <div class="order-item">
                        <span class="item-name">+${order.items.length - 3} more items</span>
                        <span></span>
                        <span class="item-price"></span>
                    </div>
                ` : ''}
            </div>
            
            <div class="order-footer">
                <div class="order-total">₹${order.total}</div>
                <div class="order-actions">
                    ${order.status !== 'completed' ? `
                        <button class="btn-track" data-order-id="${order.id}">
                            <i class="fas fa-map-marker-alt"></i> Track
                        </button>
                    ` : ''}
                    <button class="btn-reorder" data-order-id="${order.id}">
                        <i class="fas fa-redo"></i> Reorder
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showOrderTracking(orderId) {
    const order = [...activeOrders, ...orderHistory].find(o => o.id === orderId);
    if (!order) return;
    
    const status = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
    const estimatedTime = order.estimatedReadyTime || 30;
    
    const timelineSteps = Object.values(ORDER_STATUS).map(step => {
        const stepHistory = order.statusHistory.find(h => h.status === step.id);
        const isCompleted = order.statusHistory.some(h => h.status === step.id);
        const isCurrent = order.status === step.id;
        
        return `
            <div class="timeline-step">
                <div class="step-icon ${isCompleted ? 'completed' : (isCurrent ? 'active' : '')}">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div class="step-content">
                    <h4>${step.label}</h4>
                    ${stepHistory ? `
                        <p>${getStatusMessage(step.id)}</p>
                        <small>${new Date(stepHistory.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const modalHTML = `
        <div class="modal order-tracking-modal">
            <div class="modal-content">
                <div class="tracking-header">
                    <h2><i class="fas fa-map-marker-alt"></i> Order Tracking</h2>
                    <div class="order-id-display">${order.id}</div>
                    <div class="order-status status-${order.status}">
                        <i class="fas ${status.icon}"></i> ${status.label}
                    </div>
                </div>
                <div class="tracking-body">
                    <div class="order-info">
                        <p><i class="fas fa-chair"></i> Table ${order.tableNumber}</p>
                        <p><i class="fas fa-clock"></i> Ordered at ${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    
                    <div class="tracking-timeline">
                        <div class="timeline-track"></div>
                        ${timelineSteps}
                    </div>
                    
                    <div class="tracking-estimate">
                        <h4><i class="fas fa-hourglass-half"></i> Estimated Time</h4>
                        <div class="time-estimate">${estimatedTime} min</div>
                        <p>Your food will be ready in approximately ${estimatedTime} minutes</p>
                    </div>
                </div>
                <div class="modal-actions" style="padding: 20px; text-align: center;">
                    <button class="btn-primary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
        document.querySelector('.order-tracking-modal').style.display = 'flex';
    }, 10);
}

function reorderItems(orderId) {
    const order = [...activeOrders, ...orderHistory].find(o => o.id === orderId);
    if (!order) return;
    
    // Add items to cart
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                ...menuItems.find(m => m.id === item.id),
                quantity: item.quantity
            });
        }
    });
    
    updateCartDisplay();
    loadMenu(); // Refresh menu to show updated quantities
    showNotification('Items added to cart! You can modify quantities before ordering.', 'success');
}

// Check for order to track after page load
window.addEventListener('load', function() {
    const trackOrderId = localStorage.getItem('track_order_id');
    if (trackOrderId) {
        localStorage.removeItem('track_order_id');
        setTimeout(() => {
            if (document.getElementById('ordersSection')) {
                showActiveOrders();
                setTimeout(() => showOrderTracking(trackOrderId), 500);
            }
        }, 1000);
    }
});