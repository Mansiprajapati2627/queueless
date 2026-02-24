import React, { useState } from 'react';
import { TABLE_COUNT } from '../utils/constants';
import { useCart } from '../hooks/useCart';

const TableSelector = () => {
  const { tableNumber, setTableNumber } = useCart();
  const [manualInput, setManualInput] = useState('');

  const handleTableClick = (num) => {
    setTableNumber(num);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(manualInput, 10);
    if (num >= 1 && num <= TABLE_COUNT) {
      setTableNumber(num);
      setManualInput('');
    } else {
      alert(`Please enter a number between 1 and ${TABLE_COUNT}`);
    }
  };

  return (
    <div className="table-selector">
      <h2>Select your table</h2>
      {tableNumber ? (
        <p className="selected-table">You are at Table {tableNumber}</p>
      ) : (
        <>
          <div className="table-grid">
            {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`table-btn ${tableNumber === num ? 'selected' : ''}`}
                onClick={() => handleTableClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <form onSubmit={handleManualSubmit} className="manual-input">
            <input
              type="number"
              min="1"
              max={TABLE_COUNT}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Or enter table number"
            />
            <button type="submit">Confirm</button>
          </form>
        </>
      )}
    </div>
  );
};

export default TableSelector;