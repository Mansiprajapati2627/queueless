import { useState, useEffect } from 'react';
import { useNotifications as useNotificationContext } from '../context/NotificationContext';

export const useNotifications = () => {
  const context = useNotificationContext();

  const sendOrderNotification = (order) => {
    context.addNotification({
      type: 'order',
      title: 'New Order',
      message: `Order #${order.id} received`,
      data: { orderId: order.id }
    });
  };

  const sendPaymentNotification = (payment) => {
    context.addNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount} received`,
      data: { paymentId: payment.id }
    });
  };

  const sendStatusNotification = (orderId, status) => {
    context.addNotification({
      type: 'status',
      title: 'Order Status Updated',
      message: `Order #${orderId} is now ${status}`,
      data: { orderId, status }
    });
  };

  const sendAlert = (title, message, type = 'alert') => {
    context.addNotification({
      type,
      title,
      message
    });
  };

  return {
    ...context,
    sendOrderNotification,
    sendPaymentNotification,
    sendStatusNotification,
    sendAlert
  };
};