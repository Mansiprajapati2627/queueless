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
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            color: 'white'
          }}>
            🍽️
          </div>
          <h1 className="hero-title">Welcome to Taste Haven</h1>
          <p className="hero-subtitle">
            Experience fine dining with zero wait time. Order directly from your table.
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

      {/* Restaurant Highlights */}
      <section className="features-section">
        <h2 className="section-title">Why Dine With us? </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Fast Service</h3>
            <p>Average serving time: 15 minutes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Premium Quality</h3>
            <p>Fresh ingredients, expert chefs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Fresh & Local</h3>
            <p>Locally sourced ingredients</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>Family Friendly</h3>
            <p>Special menu for kids</p>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section style={{ width: '100%', padding: '0 20px', marginTop: '40px' }}>
        <h2 className="section-title">Today's Specials</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow)',
            textAlign: 'center',
            border: '2px solid var(--primary)',
            transition: 'transform 0.3s'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '10px',
              color: 'var(--primary)'
            }}>🔥</div>
            <h3>Chef's Special</h3>
            <p>Signature Biryani with Raita</p>
            <div style={{
              color: 'var(--primary)',
              fontWeight: '600',
              marginTop: '10px'
            }}>₹350</div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow)',
            textAlign: 'center',
            border: '2px solid var(--success)',
            transition: 'transform 0.3s'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '10px',
              color: 'var(--success)'
            }}>🥬</div>
            <h3>Healthy Choice</h3>
            <p>Fresh Salad Bowl</p>
            <div style={{
              color: 'var(--success)',
              fontWeight: '600',
              marginTop: '10px'
            }}>₹180</div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow)',
            textAlign: 'center',
            border: '2px solid var(--warning)',
            transition: 'transform 0.3s'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '10px',
              color: 'var(--warning)'
            }}>🍰</div>
            <h3>Dessert Special</h3>
            <p>Chocolate Lava Cake</p>
            <div style={{
              color: 'var(--warning)',
              fontWeight: '600',
              marginTop: '10px'
            }}>₹220</div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      {user && tableNumber && (
        <div className="status-section" style={{ width: '100%', padding: '0 20px', marginTop: '40px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-chair"></i>
              </div>
              <div>
                <h3>Ready to Order!</h3>
                <p>You're at Table {tableNumber}</p>
              </div>
            </div>
            <div className="status-actions">
              <button onClick={() => navigate('/menu')} className="btn btn-primary">
                <i className="fas fa-utensils"></i> View Menu
              </button>
              {cartCount > 0 && (
                <button onClick={() => navigate('/cart')} className="btn btn-secondary">
                  <i className="fas fa-shopping-cart"></i> View Cart ({cartCount} items)
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
                style={{
                  padding: '12px 16px',
                  border: '2px solid var(--gray-300)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem',
                  width: '100%',
                  margin: '16px 0'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', margin: '16px 0', width: '100%' }}>
                {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setManualTable(num.toString())}
                    style={{ 
                      padding: '8px', 
                      width: '100%',
                      background: manualTable === num.toString() ? 'var(--primary)' : 'white',
                      color: manualTable === num.toString() ? 'white' : 'var(--dark)',
                      border: `2px solid ${manualTable === num.toString() ? 'var(--primary)' : 'var(--gray-300)'}`,
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
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
                Confirm Table
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;