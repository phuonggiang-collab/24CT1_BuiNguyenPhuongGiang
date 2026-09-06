import React, { useState } from 'react';
import { X, MapPin, Truck, CreditCard, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CheckoutModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { user } = useAuth();
  const { selectedItems, subtotal, discountAmount, shippingFee, totalAmount, appliedVoucher, clearCart } = useCart();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('FAST');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Address inputs
  const defaultAddress = user?.addresses?.find(a => a.is_default) || user?.addresses?.[0] || {
    receiver_name: user?.full_name || 'Bùi Nguyễn Phương Giang',
    phone: user?.phone || '0987654321',
    detailed_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  };

  const [receiverName, setReceiverName] = useState(defaultAddress.receiver_name);
  const [phone, setPhone] = useState(defaultAddress.phone);
  const [address, setAddress] = useState(defaultAddress.detailed_address);

  if (!isOpen) return null;

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!receiverName || !phone || !address) {
      addToast('Vui lòng điền đầy đủ thông tin nhận hàng', 'error');
      return;
    }

    if (selectedItems.length === 0) {
      addToast('Không có sản phẩm nào được chọn để thanh toán!', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        items: selectedItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        custom_address: {
          receiver_name: receiverName,
          phone,
          detailed_address: address
        },
        voucher_code: appliedVoucher ? appliedVoucher.code : undefined,
        payment_method: paymentMethod,
        notes
      };

      const res = await api.createOrder(orderData);

      if (res.success && res.order) {
        addToast('Đặt hàng thành công! Đơn hàng đã được tạo. 🍇', 'success');
        clearCart();
        onClose();
        if (onOrderSuccess) {
          onOrderSuccess(res.order);
        }
      } else {
        addToast(res.message || 'Đặt hàng thất bại', 'error');
      }
    } catch (err) {
      addToast('Lỗi khi gửi đơn hàng', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="grape-modal-backdrop" onClick={onClose}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '680px', width: '100%', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--grape-900)', marginBottom: '20px' }}>
          Thanh Toán Đơn Hàng Grape Store 🍇
        </h2>

        <form onSubmit={handleCreateOrder}>
          {/* Section 1: Delivery Address */}
          <div style={{
            background: 'var(--grape-50)',
            border: '1px solid var(--grape-200)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--grape-700)', marginBottom: '12px', fontSize: '0.92rem' }}>
              <MapPin size={18} color="var(--accent-500)" />
              <span>Địa Chỉ Nhận Hàng</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Họ và tên người nhận"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                required
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <input
                type="tel"
                placeholder="Số điện thoại nhận hàng"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
            <input
              type="text"
              placeholder="Địa chỉ cụ thể (Số nhà, đường, phường, quận/huyện, tỉnh/thành)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Section 2: Items Summary */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Sản phẩm thanh toán ({selectedItems.length})
            </div>
            <div style={{ maxHeight: '130px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px' }}>
              {selectedItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
                    <img src={item.image_url} alt="" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                  </div>
                  <div style={{ minWidth: '130px', textAlign: 'right', fontWeight: 600 }}>
                    {formatPrice(item.sale_price)} x {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
              <CreditCard size={18} color="var(--grape-600)" />
              <span>Phương Thức Thanh Toán</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { id: 'COD', label: '💵 COD (Khi nhận hàng)', desc: 'Thanh toán tiền mặt' },
                { id: 'MOMO', label: '🟣 Ví MoMo', desc: 'Quét mã QR tức thì' },
                { id: 'GRAPEPAY', label: '🍇 Ví GrapePay', desc: 'Hoàn xu 5%' },
                { id: 'BANKING', label: '🏦 Chuyển khoản', desc: 'VietQR 24/7' }
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id)}
                  style={{
                    border: paymentMethod === p.id ? '2px solid var(--grape-600)' : '1px solid #CBD5E1',
                    background: paymentMethod === p.id ? 'var(--grape-50)' : '#FFFFFF',
                    borderRadius: '6px',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{p.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Lời nhắn cho người bán / Đơn vị vận chuyển (Tùy chọn)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Section 4: Cost Calculation Breakdown */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Tổng tiền hàng:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--accent-600)' }}>
                <span>Voucher giảm giá ({appliedVoucher?.code}):</span>
                <span style={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#10B981' : 'var(--text-primary)' }}>
                {shippingFee === 0 ? 'MIỄN PHÍ' : formatPrice(shippingFee)}
              </span>
            </div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--grape-900)' }}>Tổng Thanh Toán:</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--grape-600)' }}>
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: 'var(--shadow-orange)'
            }}
          >
            {submitting ? 'ĐANG XỬ LÝ ĐƠN HÀNG...' : 'ĐẶT HÀNG NGAY 🍇'}
          </button>
        </form>
      </div>
    </div>
  );
};
