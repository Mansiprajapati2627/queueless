import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...',
  delay = 300,
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {query && (
        <button className="search-clear" onClick={handleClear}>
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;