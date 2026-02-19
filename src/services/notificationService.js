export const notificationService = {
  sendOrderNotification: async (order, type = 'email') => {
    // Simulate sending notification
    console.log(`Sending ${type} notification for order ${order.id}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Notification sent via ${type}`
        });
      }, 500);
    });
  },

  sendBulkNotification: async (customers, message, type = 'email') => {
    // Simulate bulk notification
    console.log(`Sending bulk ${type} to ${customers.length} customers`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          sent: customers.length,
          message: `Notifications sent to ${customers.length} customers`
        });
      }, 1000);
    });
  },

  sendSMS: async (phone, message) => {
    // Simulate SMS sending
    console.log(`Sending SMS to ${phone}: ${message}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'SMS sent successfully'
        });
      }, 500);
    });
  },

  sendEmail: async (email, subject, message) => {
    // Simulate email sending
    console.log(`Sending email to ${email}: ${subject}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Email sent successfully'
        });
      }, 500);
    });
  }
};