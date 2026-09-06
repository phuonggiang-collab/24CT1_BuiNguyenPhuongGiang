import React from 'react';
import { Star, ShoppingBag, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onSelectProduct, isFlashSaleMode = false }) => {
  const { addToCart } = useCart();

  const discountPercent = product.discount_percent ||
    Math.round(((product.original_price - product.sale_price) / product.original_price) * 100);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const formatSold = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div
      className="grape-product-card"
      onClick={() => onSelectProduct(product.id)}
    >
      {/* Image Wrap */}
      <div className="card-image-wrap">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        
        {discountPercent > 0 && (
          <div className="discount-badge-ribbon">
            -{discountPercent}%
          </div>
        )}

        <div className="freeship-tag">
          FREESHIP XTRA
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <h3 className="product-name-heading" title={product.name}>
          {product.name}
        </h3>

        {/* Voucher tags */}
        <div className="product-vouchers-tags">
          <span className="mini-voucher-tag">Giảm 50K</span>
          <span className="mini-voucher-tag">Freeship</span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">{formatPrice(product.sale_price)}</span>
          {product.original_price > product.sale_price && (
            <span className="original-price">{formatPrice(product.original_price)}</span>
          )}
        </div>

        {/* Flash Sale Progress or Rating Meta */}
        {isFlashSaleMode ? (
          <div className="flash-progress-bar">
            <div
              className="flash-progress-fill"
              style={{ width: `${product.progress_percent || 75}%` }}
            />
            <span className="flash-progress-text">
              🔥 ĐÃ BÁN {product.sold_quantity || 120}
            </span>
          </div>
        ) : (
          <div className="card-footer-meta">
            <div className="product-rating">
              <Star size={12} fill="var(--accent-500)" color="var(--accent-500)" />
              <span>{product.rating_avg || 4.9}</span>
            </div>
            <span>Đã bán {formatSold(product.sold_quantity || 150)}</span>
          </div>
        )}
      </div>

      {/* Quick Add To Cart Button */}
      <button
        onClick={handleQuickAdd}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--grape-600)',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          opacity: 0.9,
          transition: 'all 0.2s ease',
          zIndex: 5
        }}
        title="Thêm nhanh vào giỏ"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
