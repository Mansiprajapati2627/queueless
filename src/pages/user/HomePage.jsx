import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Clock, Coffee, Award, Users, Star, TrendingUp } from 'lucide-react';
import { dummyMenu } from '../../utils/dummyData';

const slides = [
  { id: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200', title: 'Fresh Ingredients' },
  { id: 2, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200', title: 'Chef Specials' },
  { id: 3, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200', title: 'Healthy Meals' },
  { id: 4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', title: 'Delicious Desserts' },
];

const testimonials = [
  { id: 1, name: 'Sarah Johnson', comment: 'The food is absolutely amazing! Fast service and great atmosphere.', rating: 5 },
  { id: 2, name: 'Michael Chen', comment: 'Best place in town for a quick and delicious meal. Highly recommended!', rating: 5 },
  { id: 3, name: 'Priya Patel', comment: 'Love the variety and the quality. The staff is very friendly.', rating: 5 },
];

const features = [
  { icon: Coffee, title: 'Fresh Daily', description: 'All meals prepared fresh every day' },
  { icon: Award, title: 'Quality Ingredients', description: 'Sourced from local farmers' },
  { icon: Users, title: 'Family Friendly', description: 'Perfect for group dining' },
  { icon: TrendingUp, title: 'Fast Service', description: 'Quick order processing' },
];

const popularItems = dummyMenu.filter((_, index) => index < 6);

const HomePage = () => {
  const { tableNumber } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to QueueLess</h1>
        <p>Skip the line, enjoy your meal</p>
        {tableNumber && <p className="table-badge">You are at Table {tableNumber}</p>}
      </section>

      {/* Image Slideshow */}
      <section className="slideshow-section">
        <h2>Our Culinary Highlights</h2>
        <div className="slideshow-container">
          <div className="slide">
            <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
            <div className="slide-caption">{slides[currentSlide].title}</div>
          </div>
          <div className="slide-dots">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="popular-dishes">
        <h2>Popular Dishes</h2>
        <div className="dishes-grid">
          {popularItems.map(item => (
            <div key={item.id} className="dish-card">
              <div className="dish-image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="dish-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="dish-footer">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <Link to="/menu" className="dish-link">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <feature.icon size={40} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="offer-banner">
        <div className="offer-content">
          <h2>Special Offer!</h2>
          <p>Get 20% off on your first order</p>
          <Link to="/menu" className="offer-btn">Order Now</Link>
        </div>
      </section>

      {/* Today's Special */}
      <section className="specials">
        <h2>Today's Special</h2>
        <div className="special-card">
          <h3>Grilled Salmon with Lemon Butter</h3>
          <p>Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables.</p>
          <Link to="/menu" className="special-link">View Menu</Link>
        </div>
      </section>

      {/* Canteen Speciality */}
      <section className="speciality">
        <h2>Our Canteen Speciality</h2>
        <div className="speciality-content">
          <div className="speciality-text">
            <h3>Authentic Flavors Since 1995</h3>
            <p>We take pride in serving freshly prepared meals using traditional recipes passed down through generations. Our chefs use only the finest ingredients to bring you an unforgettable dining experience.</p>
            <ul>
              <li>✓ Freshly baked breads daily</li>
              <li>✓ Locally sourced vegetables</li>
              <li>✓ Signature spice blends</li>
              <li>✓ Homestyle cooking</li>
            </ul>
            <Link to="/menu" className="speciality-btn">Explore Our Menu</Link>
          </div>
          <div className="speciality-image">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" alt="Our kitchen" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p className="comment">"{t.comment}"</p>
              <p className="customer-name">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Opening Hours */}
      <section className="hours-section">
        <Clock size={24} />
        <h2>Opening Hours</h2>
        <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
        <p>Saturday - Sunday: 9:00 AM - 11:00 PM</p>
      </section>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/menu" className="action-btn">Order Now</Link>
        <Link to="/tracking" className="action-btn">Track Order</Link>
      </div>
    </div>
  );
};

export default HomePage;