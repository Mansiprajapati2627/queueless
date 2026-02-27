import React from 'react';
import { CATEGORIES } from '../utils/constants';

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={activeCategory === cat ? 'active' : ''}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;