import React, { useState, useEffect } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import MenuItemCard from '../../components/MenuItemCard';
import { fetchMenu } from '../../services/menuService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('Snacks');
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu()
      .then(res => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load menu');
        setLoading(false);
      });
  }, []);

  const filteredItems = menu.filter(item => item.category === activeCategory);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="menu-page">
      <h2>Our Menu</h2>
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <div className="menu-grid">
        {filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;