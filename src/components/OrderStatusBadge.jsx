import React from 'react';
import { getStatusColor } from '../utils/helpers';

const OrderStatusBadge = ({ status }) => {
  return (
    <span className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;