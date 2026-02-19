import React from 'react';

const TableGrid = ({ tables, onTableClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      available: '#4CAF50',
      occupied: '#f44336',
      reserved: '#FFC107',
      maintenance: '#9C27B0'
    };
    return colors[status] || '#999';
  };

  return (
    <div className="table-grid">
      {tables.map((table) => (
        <div
          key={table.id}
          className="table-item"
          style={{ borderColor: getStatusColor(table.status) }}
          onClick={() => onTableClick(table)}
        >
          <div className="table-number">{table.number}</div>
          <div className="table-capacity">{table.capacity} seats</div>
          <div className="table-status">{table.status}</div>
        </div>
      ))}
    </div>
  );
};

export default TableGrid;