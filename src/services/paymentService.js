export const paymentService = {
  processUPIPayment: async (paymentData) => {
    // Simulate UPI payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN${Date.now()}`,
          message: 'Payment successful'
        });
      }, 1500);
    });
  },

  processCardPayment: async (paymentData) => {
    // Simulate card payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN${Date.now()}`,
          message: 'Payment successful'
        });
      }, 2000);
    });
  },

  validateUPIId: (upiId) => {
    const upiRegex = /^[\w\.\-]+@[\w\.\-]+$/;
    return upiRegex.test(upiId);
  },

  generateQRCode: (data) => {
    // In real app, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}`;
  }
};