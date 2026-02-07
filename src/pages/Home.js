import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, tableNumber, cartCount, activeOrdersCount, onShowLogin, onTableScan }) => {
  const navigate = useNavigate();
  const [showTableModal, setShowTableModal] = useState(false);
  const [manualTable, setManualTable] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow images - College canteen focused
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1200&h=600&fit=crop",
      title: "College Canteen Delights",
      subtitle: "Quick, delicious meals between classes"
    },
    {
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=600&fit=crop",
      title: "Student-Friendly Prices",
      subtitle: "Quality food that fits your budget"
    },
    {
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=600&fit=crop",
      title: "Quick Service",
      subtitle: "Get your food fast, get back to class faster"
    }
  ];

  // Featured menu items for college students
  const featuredMenuItems = [
    {
      id: 1,
      name: "Combo Meal",
      description: "Burger + Fries + Cold Drink - Perfect value meal",
      price: 180,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "Coffee & Sandwich",
      description: "Quick breakfast or study snack",
      price: 120,
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
      tag: "Student Favorite"
    },
    {
      id: 5,
      name: "Cold Brew Coffee",
      description: "Energy boost for those long study sessions",
      price: 80,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      tag: "Exam Special"
    }
  ];

  // College canteen features
  const canteenFeatures = [
    {
      icon: "fas fa-clock",
      title: "Quick Service",
      description: "Under 10-minute waiting time"
    },
    {
      icon: "fas fa-rupee-sign",
      title: "Student Budget",
      description: "Meals starting from ₹50"
    },
    {
      icon: "fas fa-wifi",
      title: "Free WiFi",
      description: "Study while you eat"
    },
    {
      icon: "fas fa-users",
      title: "Group Discounts",
      description: "Special rates for groups"
    }
  ];

  // Daily specials
  const dailySpecials = [
    { day: "Mon", special: "Pasta Day", price: "₹120" },
    { day: "Tue", special: "Burger Combo", price: "₹150" },
    { day: "Wed", special: "Pizza Special", price: "₹200" },
    { day: "Thu", special: "Sandwich + Drink", price: "₹100" },
    { day: "Fri", special: "Fries & Shake", price: "₹130" }
  ];

  // Auto-rotate slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'customer') {
        if (tableNumber) {
          navigate('/menu');
        } else {
          setShowTableModal(true);
        }
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'kitchen') {
        navigate('/kitchen');
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

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <main className="main-content">
      {/* College Announcement Banner */}
      <div className="college-banner" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '1rem 2rem',
        textAlign: 'center',
        borderRadius: 'var(--border-radius)',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
          <strong>STUDENT SPECIAL:</strong> Show your college ID for 10% discount on all orders!
        </p>
        <button 
          onClick={() => navigate('/menu')}
          className="btn btn-sm"
          style={{
            background: 'white',
            color: 'var(--primary)',
            marginTop: '0.5rem',
            padding: '0.25rem 1rem'
          }}
        >
          VIEW MENU
        </button>
      </div>

      {/* Slideshow Section */}
      <section className="slideshow-section" style={{ marginBottom: '3rem' }}>
        <div className="slideshow-container" style={{
          position: 'relative',
          borderRadius: 'var(--border-radius-lg)',
          overflow: 'hidden',
          height: '400px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s ease',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '600px' }}>
                <h1 style={{ 
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {slide.title}
                </h1>
                <p style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '2rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {slide.subtitle}
                </p>
                <button 
                  onClick={handleGetStarted}
                  className="btn btn-primary"
                  style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                >
                  {!user ? 'Login to Order' : 
                   user.role === 'admin' ? 'Go to Admin Panel' :
                   user.role === 'kitchen' ? 'Go to Kitchen' :
                   !tableNumber ? 'Scan Table' : 'Browse Menu'}
                </button>
              </div>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Dots Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* A Place to Talk Section - College Edition */}
      <section className="place-to-talk-section" style={{
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'var(--white)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              color: 'var(--charcoal)',
              marginBottom: '1rem'
            }}>
              The Campus Hangout
            </h2>
            <p style={{ 
              color: 'var(--charcoal-light)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Your go-to spot between classes! With seating for 25+ students, it's the perfect place 
              to grab a quick bite, study with friends, or just relax. Fast service, student-friendly 
              prices, and free WiFi.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {canteenFeatures.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--charcoal)' }}>{feature.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)' }}>{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/menu')}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              VIEW MENU
            </button>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              height: '300px',
              backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </div>
        </div>
      </section>

      {/* Daily Specials Section */}
      <section className="daily-specials" style={{
        background: 'var(--gray-100)',
        padding: '2rem',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          color: 'var(--charcoal)',
          marginBottom: '1.5rem'
        }}>
          🎓 This Week's Specials
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {dailySpecials.map((special, index) => (
            <div key={index} style={{
              background: 'var(--white)',
              padding: '1rem',
              borderRadius: 'var(--border-radius)',
              minWidth: '120px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--primary)',
                marginBottom: '0.5rem'
              }}>
                {special.day}
              </div>
              <div style={{ 
                fontWeight: '600',
                color: 'var(--charcoal)',
                marginBottom: '0.25rem'
              }}>
                {special.special}
              </div>
              <div style={{ 
                color: 'var(--primary)',
                fontWeight: '700'
              }}>
                {special.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="featured-menu-section" style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--charcoal)'
          }}>
            Student Favorites
          </h2>
          <button 
            onClick={() => navigate('/menu')}
            className="btn btn-secondary"
          >
            View Full Menu
          </button>
        </div>
        
        <div className="featured-menu-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {featuredMenuItems.map((item) => (
            <div 
              key={item.id}
              className="featured-menu-card"
              onClick={() => navigate('/menu')}
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                {item.tag && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {item.tag}
                  </div>
                )}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    color: 'var(--charcoal)',
                    margin: 0
                  }}>
                    {item.name}
                  </h3>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--primary)'
                  }}>
                    ₹{item.price}
                  </span>
                </div>
                <p style={{
                  color: 'var(--charcoal-light)',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Order Process */}
      <section className="order-process" style={{
        background: 'var(--white)',
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow)'
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          color: 'var(--charcoal)',
          marginBottom: '2rem'
        }}>
          How Queueless Works
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-qrcode"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>1. Scan Table QR</h4>
            <p style={{ color: 'var(--charcoal-light)', fontSize: '0.9rem' }}>Scan the QR code at your table</p>
          </div>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-utensils"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>2. Order Food</h4>
            <p style={{ color: 'var(--charcoal-light)', fontSize: '0.9rem' }}>Browse menu & add items to cart</p>
          </div>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>3. Pay Online</h4>
            <p style={{ color: 'var(--charcoal-light)', fontSize: '0.9rem' }}>Secure UPI or card payment</p>
          </div>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-clock"></i>
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>4. Track Order</h4>
            <p style={{ color: 'var(--charcoal-light)', fontSize: '0.9rem' }}>Real-time updates till delivery</p>
          </div>
        </div>
      </section>

      {/* Student Discount Banner */}
      <div className="student-discount-banner" style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: 'var(--border-radius-lg)',
        margin: '3rem 0',
        textAlign: 'center',
        boxShadow: 'var(--shadow)'
      }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          marginBottom: '1rem'
        }}>
          🎓 Student Benefits 🎓
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          Show your college ID and get exclusive student discounts! Perfect for budget-friendly meals between classes.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>10% OFF</div>
            <div style={{ fontSize: '0.9rem' }}>All Orders</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>Free Drink</div>
            <div style={{ fontSize: '0.9rem' }}>On Orders Above ₹300</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>Group Deals</div>
            <div style={{ fontSize: '0.9rem' }}>Special Rates for Friends</div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      {user && tableNumber && user.role === 'customer' && (
        <div className="status-section" style={{ width: '100%' }}>
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

      {/* Admin/Kichen Status Section */}
      {(user?.role === 'admin' || user?.role === 'kitchen') && (
        <div className="status-section" style={{ width: '100%' }}>
          <div className="card">
            <h3>Staff Dashboard Access</h3>
            <p>You're logged in as {user.role.toUpperCase()}</p>
            <div className="status-actions">
              <button 
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/kitchen')} 
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-secondary"
              >
                View Customer Site
              </button>
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