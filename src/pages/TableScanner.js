import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableScanner = ({ onScanComplete, user }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [scanError, setScanError] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const tableNum = parseInt(manualInput);
    if (tableNum >= 1 && tableNum <= 25) {
      onScanComplete(tableNum);
      navigate('/');
    } else {
      setScanError('Please enter a valid table number (1-25)');
    }
  };

  const handleTableClick = (tableNum) => {
    setManualInput(tableNum.toString());
  };

  const simulateQRScan = () => {
    // Simulate QR code scan
    setScanning(false);
    setTimeout(() => {
      const randomTable = Math.floor(Math.random() * 25) + 1;
      onScanComplete(randomTable);
      navigate('/');
    }, 2000);
  };

  return (
    <main className="main-content">
      <div className="scanner-container">
        <div className="scanner-header">
          <i className="fas fa-qrcode" style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--primary)' }}></i>
          <h1>Scan Table QR</h1>
          <p>Point your camera at the QR code on your table</p>
        </div>

        {/* QR Scanner Placeholder */}
        <div className="scanner-viewport">
          {scanning ? (
            <div className="scanner-placeholder">
              <div style={{ 
                width: '250px', 
                height: '250px', 
                position: 'relative',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                margin: '0 auto',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--border-radius)'
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
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  animation: 'scan 2s infinite linear'
                }}></div>
                
                {/* Simulated QR pattern */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    Table QR Code
                  </div>
                </div>
              </div>
              <p style={{ color: 'white', marginTop: '20px' }}>Align QR code within frame</p>
              <button
                onClick={simulateQRScan}
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
              >
                <i className="fas fa-camera"></i> Simulate Scan
              </button>
            </div>
          ) : (
            <div className="camera-off" style={{ color: 'white', padding: '2rem' }}>
              <i className="fas fa-camera-slash" style={{ fontSize: '64px', marginBottom: '16px' }}></i>
              <h3>Camera Permission Required</h3>
              <p>Please enable camera access to scan QR codes</p>
            </div>
          )}
        </div>

        {/* Manual Input */}
        {showManual ? (
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '24px',
            marginTop: '20px',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Enter Table Number</h3>
            {scanError && (
              <div style={{
                background: 'var(--accent-light)',
                color: 'var(--blush-dark)',
                padding: '12px',
                borderRadius: 'var(--border-radius-sm)',
                marginBottom: '16px',
                fontSize: '0.875rem'
              }}>
                {scanError}
              </div>
            )}
            <form onSubmit={handleManualSubmit}>
              <input
                type="number"
                min="1"
                max="25"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setScanError('');
                }}
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
                    onClick={() => {
                      handleTableClick(num);
                      setScanError('');
                    }}
                    style={{
                      padding: '12px',
                      border: '2px solid var(--gray-300)',
                      borderRadius: 'var(--border-radius)',
                      background: manualInput === num.toString() ? 'var(--primary)' : 'white',
                      color: manualInput === num.toString() ? 'white' : 'var(--charcoal)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowManual(false);
                    setScanError('');
                  }}
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
              style={{ marginBottom: '12px' }}
            >
              <i className="fas fa-keypad"></i>
              Enter Table Manually
            </button>
            
            <button
              onClick={() => setScanning(!scanning)}
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'white' }}
            >
              {scanning ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
              style={{ marginTop: '12px', color: 'white', borderColor: 'white' }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </main>
  );
};

export default TableScanner;