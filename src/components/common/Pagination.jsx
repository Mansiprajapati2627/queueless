import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const leftSibling = Math.max(1, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages, currentPage + siblingCount);

    if (leftSibling > 2) {
      pages.push(1, '...');
    } else if (leftSibling === 2) {
      pages.push(1);
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (rightSibling < totalPages - 1) {
      pages.push('...', totalPages);
    } else if (rightSibling === totalPages - 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;