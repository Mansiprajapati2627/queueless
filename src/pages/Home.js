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

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <main className="main-content">
      {/* College Announcement Banner */}
      <div className="college-banner">
        <p><strong>STUDENT SPECIAL:</strong> Show your college ID for 10% discount on all orders!</p>
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
      <section className="slideshow-section">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`
              }}
            >
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button 
                  onClick={handleGetStarted}
                  className="btn btn-primary"
                  style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                >
                  {!user ? 'Login to Order' : !tableNumber ? 'Scan Table' : 'Browse Menu'}
                </button>
              </div>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="slide-nav-btn slide-nav-prev"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={handleNextSlide}
            className="slide-nav-btn slide-nav-next"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Dots Indicator */}
          <div className="slide-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* A Place to Talk Section - College Edition */}
      <section className="place-to-talk-section">
        <div className="place-to-talk-content">
          <div className="place-to-talk-text">
            <h2 className="place-to-talk-title">The Campus Hangout</h2>
            <p className="place-to-talk-description">
              Your go-to spot between classes! With seating for 25+ students, it's the perfect place 
              to grab a quick bite, study with friends, or just relax. Fast service, student-friendly 
              prices, and free WiFi.
            </p>
            <div className="place-to-talk-features">
              {canteenFeatures.map((feature, index) => (
                <div key={index} className="place-to-talk-feature">
                  <div className="feature-icon-container">
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <div className="feature-title">{feature.title}</div>
                    <div className="feature-description">{feature.description}</div>
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
          <div 
            className="place-to-talk-image"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop)'
            }}
          />
        </div>
      </section>

      {/* Daily Specials Section */}
      <section className="daily-specials">
        <h3 className="daily-specials-title">🎓 This Week's Specials</h3>
        <div className="daily-specials-grid">
          {dailySpecials.map((special, index) => (
            <div key={index} className="daily-special-card">
              <div className="daily-special-day">{special.day}</div>
              <div className="daily-special-name">{special.special}</div>
              <div className="daily-special-price">{special.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="featured-menu-section">
        <div className="featured-menu-header">
          <h2 className="featured-menu-title">Student Favorites</h2>
          <button 
            onClick={() => navigate('/menu')}
            className="btn btn-secondary"
          >
            View Full Menu
          </button>
        </div>
        
        <div className="featured-menu-grid">
          {featuredMenuItems.map((item) => (
            <div 
              key={item.id}
              className="featured-menu-card"
              onClick={() => navigate('/menu')}
            >
              <div 
                className="featured-menu-image"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                {item.tag && (
                  <div className="featured-menu-tag">
                    {item.tag}
                  </div>
                )}
              </div>
              <div className="featured-menu-content">
                <div className="featured-menu-header-inner">
                  <h3 className="featured-menu-name">{item.name}</h3>
                  <span className="featured-menu-price">₹{item.price}</span>
                </div>
                <p className="featured-menu-description">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Order Process */}
      <section className="order-process">
        <h3 className="order-process-title">How Queueless Works</h3>
        <div className="order-process-steps">
          <div className="process-step">
            <div className="step-icon-container">
              <i className="fas fa-qrcode"></i>
            </div>
            <h4 className="step-title">1. Scan Table QR</h4>
            <p className="step-description">Scan the QR code at your table</p>
          </div>
          <div className="process-step">
            <div className="step-icon-container">
              <i className="fas fa-utensils"></i>
            </div>
            <h4 className="step-title">2. Order Food</h4>
            <p className="step-description">Browse menu & add items to cart</p>
          </div>
          <div className="process-step">
            <div className="step-icon-container">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h4 className="step-title">3. Pay Online</h4>
            <p className="step-description">Secure UPI or card payment</p>
          </div>
          <div className="process-step">
            <div className="step-icon-container">
              <i className="fas fa-clock"></i>
            </div>
            <h4 className="step-title">4. Track Order</h4>
            <p className="step-description">Real-time updates till delivery</p>
          </div>
        </div>
      </section>

      {/* Student Discount Banner */}
      <div className="student-discount-banner">
        <h3 className="student-discount-title">🎓 Student Benefits 🎓</h3>
        <p className="student-discount-description">
          Show your college ID and get exclusive student discounts! Perfect for budget-friendly meals between classes.
        </p>
        <div className="student-benefits">
          <div className="student-benefit">
            <div className="benefit-value">10% OFF</div>
            <div className="benefit-description">All Orders</div>
          </div>
          <div className="student-benefit">
            <div className="benefit-value">Free Drink</div>
            <div className="benefit-description">On Orders Above ₹300</div>
          </div>
          <div className="student-benefit">
            <div className="benefit-value">Group Deals</div>
            <div className="benefit-description">Special Rates for Friends</div>
          </div>
        </div>
      </div>

      {/* Quick Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Queueless?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Fast Service</h3>
            <p>Under 10-minute average waiting time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <h3>Student Budget</h3>
            <p>Affordable prices for students</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-wifi"></i>
            </div>
            <h3>Free WiFi</h3>
            <p>Study while you wait</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>No Queues</h3>
            <p>Order from your table, skip the line</p>
          </div>
        </div>
      </section>

      {/* Status Section */}
      {user && tableNumber && (
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

      {/* College Social Media */}
      <div className="social-cta">
        <h4 className="social-cta-title">Campus Updates</h4>
        <p className="social-cta-description">
          Follow for daily specials, exam week deals, and campus events
        </p>
        <div className="social-icons">
          <button className="btn btn-icon" style={{ background: 'var(--gray-100)', color: 'var(--primary)' }}>
            <i className="fab fa-instagram"></i>
          </button>
          <button className="btn btn-icon" style={{ background: 'var(--gray-100)', color: 'var(--primary)' }}>
            <i className="fab fa-whatsapp"></i>
          </button>
          <button className="btn btn-icon" style={{ background: 'var(--gray-100)', color: 'var(--primary)' }}>
            <i className="fas fa-envelope"></i>
          </button>
        </div>
      </div>

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