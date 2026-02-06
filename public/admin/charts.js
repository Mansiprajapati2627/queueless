// Charts for Admin Dashboard
let revenueChart, categoryChart;

function initCharts() {
    initRevenueChart();
    initCategoryChart();
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const revenueData = {
        today: [1200, 1800, 2200, 1900, 2500, 3200, 2800, 3500, 4200, 3800, 4500, 5200],
        week: [8500, 9200, 7800, 10500, 12450, 14200, 13500],
        month: [28500, 31200, 29800, 32450, 35600, 38200, 39500, 41200, 39800, 42500, 45600, 48500]
    };
    
    const labels = {
        today: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.today,
            datasets: [{
                label: 'Revenue (₹)',
                data: revenueData.today,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Revenue: ₹${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categoryData = {
        labels: ['Main Course', 'Appetizers', 'Beverages', 'Desserts', 'Fast Food'],
        datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
                '#667eea',
                '#764ba2',
                '#4CAF50',
                '#FF9800',
                '#9C27B0'
            ],
            borderWidth: 1
        }]
    };
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: categoryData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function updateRevenueChart() {
    const period = document.getElementById('revenuePeriod').value;
    const revenueData = {
        today: [1200, 1800, 2200, 1900, 2500, 3200, 2800, 3500, 4200, 3800, 4500, 5200],
        week: [8500, 9200, 7800, 10500, 12450, 14200, 13500],
        month: [28500, 31200, 29800, 32450, 35600, 38200, 39500, 41200, 39800, 42500, 45600, 48500]
    };
    
    const labels = {
        today: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    if (revenueChart) {
        revenueChart.data.labels = labels[period];
        revenueChart.data.datasets[0].data = revenueData[period];
        revenueChart.update();
    }
}

// Export Functions
function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('queueless_admin_orders') || '[]');
    const csv = convertToCSV(orders);
    downloadCSV(csv, 'orders_export.csv');
}

function convertToCSV(data) {
    const headers = ['ID', 'Table', 'Customer', 'Total', 'Status', 'Payment', 'Time'];
    const rows = data.map(order => [
        order.id,
        order.table,
        order.customer,
        order.total,
        order.status,
        order.payment,
        new Date(order.timestamp).toLocaleString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Quick Actions
function addNewItem() {
    const itemName = prompt('Enter new menu item name:');
    if (itemName) {
        const itemPrice = parseFloat(prompt('Enter price:'));
        if (!isNaN(itemPrice)) {
            showAlert(`New menu item "${itemName}" added successfully!`, 'success');
            // In real app, add to menu database
        }
    }
}

function generateReport() {
    showAlert('Report generation started. Download will begin shortly.', 'info');
    setTimeout(() => {
        const reportData = {
            date: new Date().toLocaleDateString(),
            totalOrders: 48,
            totalRevenue: 45600,
            averageOrderValue: 950,
            topItem: 'Paneer Tikka',
            busiestHour: '1 PM'
        };
        
        const reportText = `
            Queueless Daily Report
            ======================
            
            Date: ${reportData.date}
            Total Orders: ${reportData.totalOrders}
            Total Revenue: ₹${reportData.totalRevenue}
            Average Order Value: ₹${reportData.averageOrderValue}
            Top Selling Item: ${reportData.topItem}
            Busiest Hour: ${reportData.busiestHour}
        `;
        
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `queueless_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showAlert('Report downloaded successfully!', 'success');
    }, 2000);
}

function sendBulkNotification() {
    const message = prompt('Enter notification message for all customers:');
    if (message) {
        showAlert(`Notification sent to all customers: "${message}"`, 'success');
        // In real app, send push notifications
    }
}