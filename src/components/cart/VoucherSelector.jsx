import React, { useState, useEffect } from 'react';
import { X, Ticket, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const VoucherSelector = ({ isOpen, onClose }) => {
  const [vouchers, setVouchers] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(true);

  const { subtotal, appliedVoucher, applyVoucherCode, removeVoucher } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.getVouchers().then(res => {
      if (res.success && res.vouchers) {
        setVouchers(res.vouchers);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyInput = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyVoucherCode(inputCode.trim());
    }
  };

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="grape-modal-backdrop" onClick={onClose}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '520px', width: '100%', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Ticket size={24} color="var(--accent-500)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--grape-900)' }}>
            Chọn Grape Voucher 🍇
          </h2>
        </div>

        {/* Input manual code */}
        <form onSubmit={handleApplyInput} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Nhập mã giảm giá..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1.5px solid #CBD5E1',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--grape-600)',
              color: '#FFF',
              border: 'none',
              padding: '0 20px',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Áp Dụng
          </button>
        </form>

        {/* Vouchers list */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--grape-600)' }}>
              Đang tải danh sách voucher...
            </div>
          ) : (
            vouchers.map(v => {
              const isEligible = subtotal >= v.min_spend;
              const isSelected = appliedVoucher && appliedVoucher.id === v.id;

              return (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    border: isSelected ? '2px solid var(--grape-600)' : '1px solid #E2E8F0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: isEligible ? '#FFFFFF' : '#F8FAFC',
                    opacity: isEligible ? 1 : 0.65
                  }}
                >
                  {/* Left Ticket Stub */}
                  <div style={{
                    width: '100px',
                    background: isSelected ? 'var(--grape-600)' : 'linear-gradient(135deg, var(--grape-700), var(--grape-500))',
                    color: '#FFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🍇</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: '4px' }}>{v.code}</span>
                  </div>

                  {/* Right Details */}
                  <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {v.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Đơn tối thiểu {formatPrice(v.min_spend)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Còn lại: {v.remaining_uses} lượt
                      </span>

                      {isSelected ? (
                        <button
                          onClick={removeVoucher}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Bỏ Chọn
                        </button>
                      ) : (
                        <button
                          disabled={!isEligible}
                          onClick={() => applyVoucherCode(v.code)}
                          style={{
                            background: isEligible ? 'var(--accent-500)' : '#CBD5E1',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '4px 14px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: isEligible ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Dùng Ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
