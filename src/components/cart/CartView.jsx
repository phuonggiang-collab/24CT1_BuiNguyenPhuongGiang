import React from 'react';
import { ShoppingCart, Trash2, Ticket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { VoucherSelector } from './VoucherSelector';
import { CheckoutModal } from './CheckoutModal';

export const CartView = ({ onBackToHome, onOrderSuccess }) => {
  const {
    cartItems,
    selectedItemIds,
    selectedCount,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedVoucher,
    isVoucherModalOpen,
    isCheckoutOpen,
    setIsVoucherModalOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    toggleSelectItem,
    toggleSelectAll
  } = useCart();

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  if (cartItems.length === 0) {
    return (
      <div className="grape-container" style={{ margin: '40px auto' }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          padding: '80px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--grape-900)', marginBottom: '8px' }}>
            Giỏ hàng của bạn đang trống!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Hãy khám phá hàng ngàn sản phẩm tuyệt vời trên Grape Store và thêm vào giỏ hàng ngay.
          </p>
          <button
            onClick={onBackToHome}
            style={{
              background: 'var(--grape-600)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Mua Sắm Ngay 🍇
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grape-container" style={{ margin: '24px auto' }}>
      {/* Header Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--grape-600)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Tiếp tục mua sắm</span>
        </button>
        <span style={{ color: '#CBD5E1' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Giỏ hàng</span>
      </div>

      <div className="grape-cart-container">
        {/* Table Header */}
        <div className="cart-table-header">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            style={{ width: 18, height: 18, accentColor: 'var(--grape-600)', cursor: 'pointer' }}
          />
          <span>Sản Phẩm</span>
          <span>Đơn Giá</span>
          <span>Số Lượng</span>
          <span>Số Tiền</span>
          <span style={{ textAlign: 'center' }}>Thao Tác</span>
        </div>

        {/* Cart Item Rows */}
        {cartItems.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);
          const itemTotal = item.sale_price * item.quantity;

          return (
            <div key={item.id} className="cart-item-row">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectItem(item.id)}
                style={{ width: 18, height: 18, accentColor: 'var(--grape-600)', cursor: 'pointer' }}
              />

              {/* Product Info */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: 64, height: 64, borderRadius: 6, objectFit: 'cover', border: '1px solid #E2E8F0' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.name}
                  </div>
                  <span style={{ background: 'var(--grape-50)', color: 'var(--grape-700)', fontSize: '0.72rem', padding: '2px 6px', borderRadius: '3px' }}>
                    FREESHIP XTRA
                  </span>
                </div>
              </div>

              {/* Unit Price */}
              <div>
                <span style={{ fontWeight: 700, color: 'var(--grape-600)', fontSize: '0.92rem' }}>
                  {formatPrice(item.sale_price)}
                </span>
                {item.original_price > item.sale_price && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatPrice(item.original_price)}
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div>
                <div className="qty-stepper">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, Math.min(item.stock_quantity || 99, item.quantity + 1))}>+</button>
                </div>
              </div>

              {/* Total Price */}
              <div>
                <span style={{ fontWeight: 800, color: 'var(--grape-700)', fontSize: '1rem' }}>
                  {formatPrice(itemTotal)}
                </span>
              </div>

              {/* Actions */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Voucher Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'var(--grape-50)',
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px dashed var(--grape-300)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} color="var(--accent-500)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--grape-900)' }}>Grape Voucher:</span>
            {appliedVoucher ? (
              <span style={{ background: 'var(--accent-500)', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800 }}>
                {appliedVoucher.code} ({appliedVoucher.title})
              </span>
            ) : (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Chưa áp dụng mã giảm giá</span>
            )}
          </div>

          <button
            onClick={() => setIsVoucherModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--grape-600)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {appliedVoucher ? 'Đổi Mã Khác' : 'Chọn Hoặc Nhập Mã >'}
          </button>
        </div>

        {/* Bottom Checkout Sticky Bar */}
        <div className="cart-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                style={{ width: 18, height: 18, accentColor: 'var(--grape-600)' }}
              />
              <span>Chọn Tất Cả ({cartItems.length})</span>
            </label>
          </div>

          <div className="cart-summary-totals">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Tổng thanh toán ({selectedCount} sản phẩm):
              </div>
              <div className="total-payment-amount">
                {formatPrice(totalAmount)}
              </div>
              {discountAmount > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-600)', fontWeight: 600 }}>
                  Tiết kiệm được {formatPrice(discountAmount)}
                </div>
              )}
            </div>

            <button
              className="btn-checkout-primary"
              disabled={selectedCount === 0}
              onClick={() => setIsCheckoutOpen(true)}
              style={{ opacity: selectedCount === 0 ? 0.6 : 1, cursor: selectedCount === 0 ? 'not-allowed' : 'pointer' }}
            >
              Mua Hàng ({selectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Voucher Selector Modal */}
      <VoucherSelector
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={onOrderSuccess}
      />
    </div>
  );
};
