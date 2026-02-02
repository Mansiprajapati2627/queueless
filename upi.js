// UPI Payment System
class UPIPayment {
    constructor() {
        this.paymentStatus = 'pending';
        this.paymentMethods = {
            googlepay: {
                name: 'Google Pay',
                upiId: 'restaurant@okhdfcbank',
                package: 'com.google.android.apps.nbu.paisa.user'
            },
            phonepe: {
                name: 'PhonePe',
                upiId: 'restaurant@ybl',
                package: 'com.phonepe.app'
            },
            paytm: {
                name: 'Paytm',
                upiId: 'restaurant@paytm',
                package: 'net.one97.paytm'
            },
            bhim: {
                name: 'BHIM UPI',
                upiId: 'restaurant@upi',
                package: 'in.org.npci.upiapp'
            }
        };
    }

    // Generate UPI payment link
    generateUPILink(amount, upiId, merchantName = 'Queueless Restaurant') {
        const transactionId = 'T' + Date.now();
        const transactionNote = `Payment for order #${this.generateOrderId()}`;
        
        return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR&tid=${transactionId}`;
    }

    // Generate QR code for payment
    generateQRCodeData(amount, upiId) {
        const paymentData = {
            vpa: upiId,
            name: 'Queueless Restaurant',
            amount: amount,
            currency: 'INR',
            transactionNote: `Payment for food order at Table ${localStorage.getItem('queueless_table') || '--'}`,
            transactionRef: 'ORD' + this.generateOrderId()
        };
        
        return JSON.stringify(paymentData);
    }

    // Simulate payment processing
    async processPayment(amount, method) {
        return new Promise((resolve, reject) => {
            this.paymentStatus = 'processing';
            
            // Simulate API call delay
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    this.paymentStatus = 'success';
                    resolve({
                        success: true,
                        transactionId: 'TX' + Date.now(),
                        amount: amount,
                        timestamp: new Date().toISOString(),
                        method: method
                    });
                } else {
                    this.paymentStatus = 'failed';
                    reject({
                        success: false,
                        error: 'Payment failed. Please try again.',
                        code: 'PAYMENT_FAILED'
                    });
                }
            }, 2000);
        });
    }

    // Validate UPI ID
    validateUPIId(upiId) {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        return upiRegex.test(upiId);
    }

    // Generate order ID
    generateOrderId() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Check payment status
    getPaymentStatus() {
        return this.paymentStatus;
    }

    // Get available UPI apps
    getAvailableApps() {
        return Object.keys(this.paymentMethods).map(key => ({
            id: key,
            ...this.paymentMethods[key]
        }));
    }

    // Create payment receipt
    createReceipt(paymentData) {
        return {
            receiptId: 'RCP' + Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            orderId: paymentData.transactionId,
            amount: paymentData.amount,
            paymentMethod: paymentData.method,
            status: 'PAID',
            tableNumber: localStorage.getItem('queueless_table'),
            items: JSON.parse(localStorage.getItem('queueless_cart') || '[]')
        };
    }

    // Download receipt as PDF
    downloadReceipt(receipt) {
        const receiptText = `
            ================================
                   QUEUELESS RESTAURANT
            ================================
            
            Receipt ID: ${receipt.receiptId}
            Date: ${receipt.date}
            Time: ${receipt.time}
            
            --------------------------------
            Order Details:
            --------------------------------
            Order ID: ${receipt.orderId}
            Table No: ${receipt.tableNumber}
            
            Items:
            ${receipt.items.map(item => `  ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}
            
            --------------------------------
            Payment Summary:
            --------------------------------
            Subtotal: ₹${receipt.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
            Tax (5%): ₹${receipt.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05}
            Service Charge: ₹${receipt.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.02}
            --------------------------------
            Total: ₹${receipt.amount}
            
            Payment Method: ${receipt.paymentMethod.toUpperCase()}
            Status: ${receipt.status}
            
            ================================
                  THANK YOU!
           Visit us again at Queueless
            ================================
        `;

        // Create downloadable file
        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${receipt.receiptId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize UPI payment system
const upiPayment = new UPIPayment();

// Export functions for use in HTML
window.selectUPIApp = function(app) {
    const method = upiPayment.paymentMethods[app];
    if (method) {
        // Generate payment link
        const order = JSON.parse(localStorage.getItem('queueless_order') || '{}');
        const amount = order.total ? parseFloat(order.total.replace('₹', '')) : 0;
        const upiLink = upiPayment.generateUPILink(amount, method.upiId);
        
        // Try to open UPI app
        window.location.href = upiLink;
        
        // Fallback to web UPI
        setTimeout(() => {
            window.location.href = 'upi://pay?pa=' + method.upiId + '&pn=Queueless&am=' + amount;
        }, 500);
    }
};

window.validateUPI = function() {
    const upiId = document.getElementById('upiIdInput').value;
    if (upiPayment.validateUPIId(upiId)) {
        showNotification('UPI ID is valid! You can proceed with payment.', 'success');
        return true;
    } else {
        showNotification('Please enter a valid UPI ID (e.g., mobile@bank)', 'error');
        return false;
    }
};

window.initiateUPIPayment = async function() {
    const order = JSON.parse(localStorage.getItem('queueless_order') || '{}');
    const amount = order.total ? parseFloat(order.total.replace('₹', '')) : 0;
    
    try {
        const paymentResult = await upiPayment.processPayment(amount, 'upi');
        
        if (paymentResult.success) {
            // Create and save receipt
            const receipt = upiPayment.createReceipt(paymentResult);
            localStorage.setItem('queueless_receipt', JSON.stringify(receipt));
            
            // Clear cart
            localStorage.removeItem('queueless_cart');
            localStorage.removeItem('queueless_order');
            
            return paymentResult;
        }
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
};

window.downloadUPIReceipt = function() {
    const receipt = JSON.parse(localStorage.getItem('queueless_receipt') || '{}');
    if (receipt.receiptId) {
        upiPayment.downloadReceipt(receipt);
        showNotification('Receipt downloaded successfully!', 'success');
    } else {
        showNotification('No receipt found', 'error');
    }
};

// Utility function to show notifications
function showNotification(message, type = 'success') {
    // Implementation from previous code
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// Update the UPI payment success handling

// Add this function to handle successful UPI payment
function handleUPIPaymentSuccess(paymentResult) {
    // Get order data
    const orderData = JSON.parse(localStorage.getItem('queueless_order') || '{}');
    
    // Create order
    const order = createOrder({
        amount: orderData.amount,
        method: 'upi',
        instructions: orderData.instructions
    });
    
    // Create receipt
    const receipt = upiPayment.createReceipt({
        transactionId: paymentResult.transactionId,
        amount: orderData.amount,
        method: 'upi'
    });
    
    // Save receipt
    localStorage.setItem('queueless_receipt', JSON.stringify(receipt));
    
    // Clear cart and order data
    localStorage.removeItem('queueless_cart');
    localStorage.removeItem('queueless_order');
    
    return { order, receipt };
}

// Update the initiatePayment function in upi-payment.html
function initiatePayment() {
    // Show processing animation
    document.getElementById('paymentActions').style.display = 'none';
    document.getElementById('paymentProcessing').style.display = 'block';
    
    // Simulate payment processing
    setTimeout(() => {
        // Get payment data
        const order = JSON.parse(localStorage.getItem('queueless_order') || '{}');
        
        // Create successful payment result
        const paymentResult = {
            success: true,
            transactionId: 'TX' + Date.now(),
            amount: parseFloat(order.total?.replace('₹', '') || 0),
            timestamp: new Date().toISOString(),
            method: 'upi'
        };
        
        // Handle successful payment
        const { order: newOrder } = handleUPIPaymentSuccess(paymentResult);
        
        // Show success screen
        document.getElementById('paymentProcessing').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'block';
        
        // Update success details
        document.getElementById('successOrderId').textContent = newOrder.id;
        document.getElementById('successAmount').textContent = `₹${paymentResult.amount}`;
        document.getElementById('successTime').textContent = 
            new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Add track order button
        const trackBtn = document.createElement('button');
        trackBtn.className = 'btn-secondary';
        trackBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Track Order';
        trackBtn.onclick = function() {
            window.location.href = 'index.html';
            setTimeout(() => {
                showActiveOrders();
                showOrderTracking(newOrder.id);
            }, 100);
        };
        
        document.querySelector('.success-actions').prepend(trackBtn);
    }, 3000);
}