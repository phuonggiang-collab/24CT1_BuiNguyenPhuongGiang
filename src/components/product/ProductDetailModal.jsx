import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingCart, Zap, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const ProductDetailModal = ({ productId, onClose, onBuyNow }) => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    api.getProductDetail(productId).then(res => {
      if (res.success && res.product) {
        setProduct(res.product);
        setActiveImg(res.product.image_url);
        setRelated(res.relatedProducts || []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [productId]);

  if (!productId) return null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNowClick = () => {
    if (product) {
      addToCart(product, quantity);
      if (onBuyNow) onBuyNow();
    }
  };

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="grape-modal-backdrop" onClick={onClose}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '880px', width: '100%', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--grape-600)' }}>
            Đang tải thông tin sản phẩm... 🍇
          </div>
        ) : product ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px' }}>
              {/* Product Gallery */}
              <div>
                <div style={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: '10px'
                }}>
                  <img
                    src={activeImg || product.image_url}
                    alt={product.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[product.image_url, ...(product.images || [])].map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImg(img)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: activeImg === img ? '2px solid var(--grape-600)' : '1px solid #E2E8F0'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details & Actions */}
              <div>
                <span style={{
                  background: 'var(--grape-100)',
                  color: 'var(--grape-700)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  {product.category_name}
                </span>

                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px', lineHeight: 1.35 }}>
                  {product.name}
                </h1>

                {/* Rating & Sold Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-500)', fontWeight: 700 }}>
                    <span>{product.rating_avg}</span>
                    <Star size={14} fill="var(--accent-500)" color="var(--accent-500)" />
                  </div>
                  <span style={{ color: '#CBD5E1' }}>|</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{product.rating_count} Đánh giá</span>
                  <span style={{ color: '#CBD5E1' }}>|</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Đã bán {product.sold_quantity}</span>
                </div>

                {/* Price Display */}
                <div style={{
                  background: 'var(--grape-50)',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  marginBottom: '18px'
                }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--grape-600)' }}>
                    {formatPrice(product.sale_price)}
                  </span>
                  {product.original_price > product.sale_price && (
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {product.discount_percent > 0 && (
                    <span style={{ background: 'var(--accent-500)', color: '#FFF', fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                      GIẢM {product.discount_percent}%
                    </span>
                  )}
                </div>

                {/* Vouchers & Shipping Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '90px' }}>Mã Giảm Giá:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="mini-voucher-tag">Giảm 50K</span>
                      <span className="mini-voucher-tag">Giảm 15%</span>
                      <span className="mini-voucher-tag">Freeship</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '90px' }}>Vận Chuyển:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--grape-700)', fontWeight: 600 }}>
                      <Truck size={16} color="var(--accent-500)" />
                      <span>Miễn phí vận chuyển cho đơn từ 150.000đ</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Số lượng:</span>
                  <div className="qty-stepper">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}>+</button>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {product.stock_quantity} sản phẩm có sẵn
                  </span>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      background: 'var(--grape-50)',
                      border: '1.5px solid var(--grape-600)',
                      color: 'var(--grape-600)',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.92rem'
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>

                  <button
                    onClick={handleBuyNowClick}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.92rem',
                      boxShadow: 'var(--shadow-orange)'
                    }}
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Description Tab */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', color: 'var(--grape-900)' }}>
                MÔ TẢ SẢN PHẨM
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {product.description}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
