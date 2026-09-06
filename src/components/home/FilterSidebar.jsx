import React, { useState } from 'react';
import { Filter, Star, RefreshCw, Check } from 'lucide-react';

export const FilterSidebar = ({ categories, activeCategory, onSelectCategory, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const handleApplyPrice = (e) => {
    e?.preventDefault();
    onFilterChange({
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      rating: selectedRating || undefined
    });
  };

  const handleRatingClick = (ratingVal) => {
    const newRating = selectedRating === ratingVal ? '' : ratingVal;
    setSelectedRating(newRating);
    onFilterChange({
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      rating: newRating || undefined
    });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating('');
    onSelectCategory('all');
    onFilterChange({});
  };

  return (
    <aside className="grape-sidebar-filter">
      {/* Category Filter */}
      <div className="filter-group-header">
        <Filter size={16} color="var(--grape-600)" />
        <span>TẤT CẢ DANH MỤC</span>
      </div>

      <ul className="filter-category-list">
        <li
          className={`filter-category-item ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <span>🍇 Tất Cả Ngành Hàng</span>
        </li>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`filter-category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span>{cat.icon} {cat.name}</span>
            {cat.product_count !== undefined && (
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>({cat.product_count})</span>
            )}
          </li>
        ))}
      </ul>

      {/* Price Range */}
      <div className="filter-group-header" style={{ marginTop: '20px' }}>
        <span>KHOẢNG GIÁ (VND)</span>
      </div>

      <form onSubmit={handleApplyPrice}>
        <div className="price-range-inputs">
          <input
            type="number"
            className="price-range-input"
            placeholder="₫ TỪ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span style={{ color: '#94A3B8' }}>-</span>
          <input
            type="number"
            className="price-range-input"
            placeholder="₫ ĐẾN"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-filter-apply">
          ÁP DỤNG
        </button>
      </form>

      {/* Rating Filter */}
      <div className="filter-group-header" style={{ marginTop: '22px' }}>
        <span>ĐÁNH GIÁ SAO</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[5, 4, 3].map((stars) => (
          <div
            key={stars}
            onClick={() => handleRatingClick(stars)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: selectedRating === stars ? 'var(--grape-50)' : 'transparent',
              fontSize: '0.82rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < stars ? 'var(--accent-500)' : '#E2E8F0'}
                  color={i < stars ? 'var(--accent-500)' : '#E2E8F0'}
                />
              ))}
              <span style={{ marginLeft: '4px', color: '#64748B' }}>
                {stars === 5 ? '5 sao' : `Từ ${stars} sao`}
              </span>
            </div>
            {selectedRating === stars && <Check size={14} color="var(--grape-600)" />}
          </div>
        ))}
      </div>

      {/* Reset Filter */}
      <button onClick={handleReset} className="btn-filter-reset">
        <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} />
        Xóa Tất Cả Bộ Lọc
      </button>
    </aside>
  );
};
