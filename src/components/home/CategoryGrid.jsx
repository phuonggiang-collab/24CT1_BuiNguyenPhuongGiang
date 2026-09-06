import React from 'react';
import { LayoutGrid } from 'lucide-react';

export const CategoryGrid = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="grape-category-strip">
      <div className="section-header-title">
        <LayoutGrid size={20} color="var(--grape-600)" />
        <span>DANH MỤC SẢN PHẨM NỔI BẬT</span>
      </div>

      <div className="category-items-grid">
        <button
          className={`category-item-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <div className="category-icon-box" style={{ background: activeCategory === 'all' ? 'var(--grape-600)' : undefined, color: activeCategory === 'all' ? '#FFF' : undefined }}>
            🍇
          </div>
          <span className="category-name">Tất Cả Sản Phẩm</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-item-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="category-icon-box">
              {cat.icon || '🛍️'}
            </div>
            <span className="category-name">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
