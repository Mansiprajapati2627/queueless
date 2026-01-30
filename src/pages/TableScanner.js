import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableScanner = ({ onScanComplete, user }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const tableNum = parseInt(manualInput);
    if (tableNum >= 1 && tableNum <= 25) {
      onScanComplete(tableNum);
      navigate('/');
    }
  };

  return (
    <main className="main-content">
      <div className="scanner-container">
        <div className="scanner-header">
          <i className="fas fa-qrcode" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
          <h1>Scan Table QR</h1>
          <p>Point your camera at the QR code on your table</p>
        </div>

        {/* QR Scanner Placeholder */}
        <div className="scanner-viewport">
          {scanning ? (
            <div className="scanner-placeholder">
              <div style={{ 
                width: '200px', 
                height: '200px', 
                position: 'relative',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                margin: '0 auto'
              }}>
                {/* Scanner corners */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '30px',
                  height: '30px',
                  borderTop: '4px solid white',
                  borderLeft: '4px solid white',
                  borderTopLeftRadius: '8px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '30px',
                  height: '30px',
                  borderTop: '4px solid white',
                  borderRight: '4px solid white',
                  borderTopRightRadius: '8px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '30px',
                  height: '30px',
                  borderBottom: '4px solid white',
                  borderLeft: '4px solid white',
                  borderBottomLeftRadius: '8px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '30px',
                  height: '30px',
                  borderBottom: '4px solid white',
                  borderRight: '4px solid white',
                  borderBottomRightRadius: '8px'
                }}></div>
                
                {/* Scanning line */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, white, transparent)',
                  animation: 'scan 2s infinite'
                }}></div>
                <style>{`
                  @keyframes scan {
                    0% { transform: translateY(-100px); }
                    100% { transform: translateY(100px); }
                  }
                `}</style>
              </div>
              <p style={{ color: 'white', marginTop: '20px' }}>Align QR code within frame</p>
            </div>
          ) : (
            <div className="camera-off">
              <i className="fas fa-camera-slash" style={{ fontSize: '64px', marginBottom: '16px' }}></i>
              <p>Camera permission required</p>
            </div>
          )}
        </div>

        {/* Manual Input */}
        {showManual ? (
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '24px',
            marginTop: '20px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Enter Table Number</h3>
            <form onSubmit={handleManualSubmit}>
              <input
                type="number"
                min="1"
                max="25"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter table number (1-25)"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid var(--gray-300)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setManualInput(num.toString())}
                    style={{
                      padding: '12px',
                      border: '2px solid var(--gray-300)',
                      borderRadius: 'var(--border-radius)',
                      background: 'white',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowManual(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm Table
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="scanner-actions">
            <button
              onClick={() => setShowManual(true)}
              className="btn btn-secondary"
            >
              <i className="fas fa-keypad"></i>
              Enter Manually
            </button>
            
            <button
              onClick={() => setScanning(!scanning)}
              className="btn btn-secondary"
            >
              {scanning ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default TableScanner;