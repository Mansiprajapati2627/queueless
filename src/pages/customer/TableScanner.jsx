import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';

const TableScanner = ({ onScanComplete, user }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px',
    textAlign: 'center'
  };

  const scannerStartStyle = {
    padding: '40px 20px'
  };

  const scannerIconStyle = {
    fontSize: '80px',
    color: '#667eea',
    marginBottom: '20px',
    animation: 'pulse 2s infinite'
  };

  const scannerActiveStyle = {
    position: 'relative'
  };

  const viewportStyle = {
    position: 'relative',
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    borderRadius: '12px',
    marginBottom: '20px'
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const scanRegionStyle = {
    width: '200px',
    height: '200px',
    border: '2px solid white',
    borderRadius: '12px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
    animation: 'scan 2s infinite'
  };

  const manualEntryStyle = {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #e2e8f0'
  };

  const manualFormStyle = {
    display: 'flex',
    gap: '10px',
    maxWidth: '300px',
    margin: '15px auto 0'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px'
  };

  const infoStyle = {
    marginTop: '30px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
    textAlign: 'left'
  };

  const errorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    marginTop: '20px'
  };

  useEffect(() => {
    if (!scanning) return;

    const timer = setTimeout(() => {
      const mockTableNumber = Math.floor(Math.random() * 10) + 1;
      handleScanSuccess(mockTableNumber);
    }, 3000);

    return () => clearTimeout(timer);
  }, [scanning]);

  const startScanning = async () => {
    setScanning(true);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Camera access denied. Please use manual entry.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleScanSuccess = (tableNumber) => {
    stopScanning();
    onScanComplete(tableNumber);
    navigate('/menu');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const tableNum = parseInt(manualInput);
    
    if (isNaN(tableNum) || tableNum < 1 || tableNum > 25) {
      setError('Please enter a valid table number (1-25)');
      return;
    }

    onScanComplete(tableNum);
    navigate('/menu');
  };

  return (
    <div style={containerStyle}>
      <h1>Scan Table QR Code</h1>
      
      {!scanning ? (
        <div style={scannerStartStyle}>
          <div style={scannerIconStyle}>
            <Icon name="qr" size={64} />
          </div>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Position the QR code on your table within the frame
          </p>
          <Button onClick={startScanning} icon="camera" size="lg">
            Start Scanning
          </Button>

          <div style={manualEntryStyle}>
            <h3>Or enter table number manually</h3>
            <form onSubmit={handleManualSubmit} style={manualFormStyle}>
              <input
                type="number"
                placeholder="Table number (1-25)"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                min="1"
                max="25"
                style={inputStyle}
              />
              <Button type="submit" variant="secondary">
                Confirm
              </Button>
            </form>
          </div>

          {error && (
            <div style={errorStyle}>
              <Icon name="error" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div style={scannerActiveStyle}>
          <div style={viewportStyle}>
            <video ref={videoRef} style={videoStyle} />
            <div style={overlayStyle}>
              <div style={scanRegionStyle}></div>
            </div>
          </div>
          <p style={{ marginBottom: '20px', color: '#667eea' }}>Scanning for QR code...</p>
          <Button onClick={stopScanning} variant="outline">
            Cancel
          </Button>
        </div>
      )}

      <div style={infoStyle}>
        <h4>How to scan:</h4>
        <ol style={{ marginLeft: '20px', color: '#666' }}>
          <li>Find the QR code on your table</li>
          <li>Hold your phone steady over the code</li>
          <li>Wait for automatic detection</li>
        </ol>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes scan {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default TableScanner;