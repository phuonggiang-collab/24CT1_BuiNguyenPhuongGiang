import React from 'react';
import { Sparkles, TrendingUp, PackageSearch } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const ProductGrid = ({
  products,
  sortBy,
  onSortChange,
  onSelectProduct,
  title = 'GỢI Ý HÔM NAY - ĐỀ XUẤT CHO BẠN'
}) => {
  return (
    <div style={{ flex: 1 }}>
      {/* Personalized Recommendation Banner */}
      <div className="recommendation-top-banner">
        <div className="banner-text">
          <Sparkles size={22} color="#FFD166" />
          <span>{title}</span>
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={16} />
          <span>Thuật toán gợi ý thông minh dựa trên sản phẩm bán chạy & danh mục ưa thích</span>
        </div>
      </div>

      {/* Shopee Style Sort Bar */}
      <div className="grape-sort-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="sort-label">Sắp xếp theo:</span>
          <div className="sort-btn-group">
            <button
              className={`sort-tab-btn ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => onSortChange('popular')}
            >
              Phổ Biến
            </button>
            <button
              className={`sort-tab-btn ${sortBy === 'newest' ? 'active' : ''}`}
              onClick={() => onSortChange('newest')}
            >
              Mới Nhất
            </button>
            <button
              className={`sort-tab-btn ${sortBy === 'best_seller' ? 'active' : ''}`}
              onClick={() => onSortChange('best_seller')}
            >
              Bán Chạy
            </button>
          </div>
        </div>

        <div>
          <select
            value={sortBy.startsWith('price') ? sortBy : ''}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" disabled>Giá Cả</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <PackageSearch size={48} color="var(--grape-300)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p style={{ fontSize: '0.88rem' }}>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="product-recommendations-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
