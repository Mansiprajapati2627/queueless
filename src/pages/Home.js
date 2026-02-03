import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, tableNumber, cartCount, activeOrdersCount, onShowLogin, onTableScan }) => {
  const navigate = useNavigate();
  const [showTableModal, setShowTableModal] = useState(false);
  const [manualTable, setManualTable] = useState('');

  const handleGetStarted = () => {
    if (user) {
      if (tableNumber) {
        navigate('/menu');
      } else {
        setShowTableModal(true);
      }
    } else {
      onShowLogin();
    }
  };

  const handleTableSubmit = () => {
    const tableNum = parseInt(manualTable);
    if (tableNum >= 1 && tableNum <= 25) {
      onTableScan(tableNum);
      setShowTableModal(false);
      setManualTable('');
      
      if (user) {
        navigate('/menu');
      }
    }
  };

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <i className="fas fa-utensils hero-icon"></i>
          <h1 className="hero-title">Welcome to Queueless</h1>
          <p className="hero-subtitle">
            Order food instantly from your table. No waiting, no queues.
          </p>
          
          <div className="hero-actions">
            {!tableNumber ? (
              <>
                <button onClick={() => navigate('/scan')} className="btn btn-primary">
                  <i className="fas fa-qrcode"></i>
                  Scan Table QR
                </button>
                <button onClick={() => setShowTableModal(true)} className="btn btn-secondary">
                  Enter Table Manually
                </button>
              </>
            ) : !user ? (
              <button onClick={onShowLogin} className="btn btn-primary">
                Login to Order
              </button>
            ) : (
              <button onClick={() => navigate('/menu')} className="btn btn-primary">
                <i className="fas fa-utensils"></i>
                Browse Menu
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Queueless?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-qrcode"></i>
            </div>
            <h3>Scan & Order</h3>
            <p>Scan table QR to start ordering instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>No Waiting</h3>
            <p>Skip queues and place orders directly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Secure Payment</h3>
            <p>Multiple secure payment options</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Real-time Tracking</h3>
            <p>Track your order in real-time</p>
          </div>
        </div>
      </section>

      {/* Status Section */}
      {user && tableNumber && (
        <div className="status-section" style={{ width: '100%', padding: '0 20px' }}>
          <div className="card">
            <h3>Ready to Order!</h3>
            <p>You're logged in and at Table {tableNumber}</p>
            <div className="status-actions">
              <button onClick={() => navigate('/menu')} className="btn btn-primary">
                View Menu
              </button>
              {cartCount > 0 && (
                <button onClick={() => navigate('/cart')} className="btn btn-secondary">
                  View Cart ({cartCount} items)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Table Modal */}
      {showTableModal && (
        <div className="modal-overlay" onClick={() => setShowTableModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-chair"></i> Enter Table Number</h2>
              <button onClick={() => setShowTableModal(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <p>Enter your table number (1-25):</p>
              <input
                type="number"
                min="1"
                max="25"
                value={manualTable}
                onChange={(e) => setManualTable(e.target.value)}
                placeholder="e.g., 12"
                className="input-group"
                style={{ margin: '16px 0', width: '100%' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', margin: '16px 0', width: '100%' }}>
                {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setManualTable(num.toString())}
                    className="btn btn-sm"
                    style={{ padding: '8px', width: '100%' }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowTableModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleTableSubmit} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;