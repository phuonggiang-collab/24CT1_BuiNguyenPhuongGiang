import React, { useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle, FileText } from 'lucide-react';
import { api } from '../../services/api';

export const InvoiceModal = ({ orderId, onClose }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    api.getInvoiceByOrder(orderId).then(res => {
      if (res.success) {
        setInvoiceData(res);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (p) => Number(p || 0).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="grape-modal-backdrop" onClick={onClose}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '780px', width: '100%', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Action Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--grape-600)" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--grape-900)' }}>
              HÓA ĐƠN BÁN HÀNG ĐIỆN TỬ 🍇
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'var(--grape-600)',
                color: '#FFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> In Hóa Đơn
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--grape-600)' }}>
            Đang tải dữ liệu hóa đơn điện tử...
          </div>
        ) : invoiceData ? (
          <div className="invoice-paper-sheet" id="printable-invoice">
            {/* Store & Header Grid */}
            <div className="invoice-header-grid">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🍇</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--grape-900)' }}>
                    GRAPE STORE
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  <strong>{invoiceData.storeInfo?.store_name}</strong><br />
                  Địa chỉ: {invoiceData.storeInfo?.headquarters}<br />
                  Mã số thuế: <strong>{invoiceData.storeInfo?.tax_code}</strong><br />
                  Hotline CSKH: {invoiceData.storeInfo?.hotline}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grape-700)', marginBottom: '4px' }}>
                  HÓA ĐƠN GIÁ TRỊ GIA TĂNG
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Số hóa đơn: <strong style={{ color: '#1E293B' }}>{invoiceData.invoice?.invoice_number}</strong><br />
                  Mã đơn hàng: <strong>{invoiceData.order?.order_code}</strong><br />
                  Ngày lập: {new Date(invoiceData.invoice?.issued_date || invoiceData.order?.order_date).toLocaleDateString('vi-VN')}<br />
                  Hình thức: {invoiceData.order?.payment_method}
                </div>
              </div>
            </div>

            {/* Customer Info Box */}
            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <strong>Khách hàng:</strong> {invoiceData.invoice?.customer_name}<br />
                  <strong>Địa chỉ giao:</strong> {invoiceData.invoice?.shipping_address}
                </div>
                <div>
                  <strong>Số điện thoại:</strong> {invoiceData.invoice?.customer_phone}<br />
                  <strong>Email:</strong> {invoiceData.invoice?.customer_email}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>STT</th>
                  <th>Tên Sản Phẩm / Dịch Vụ</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Số Lượng</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Đơn Giá</th>
                  <th style={{ textAlign: 'right', width: '140px' }}>Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                {(invoiceData.items || []).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(item.unit_price)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatPrice(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <div style={{ width: '320px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Cộng tiền hàng:</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(invoiceData.invoice?.subtotal)}</span>
                </div>
                {invoiceData.invoice?.discount_amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--accent-600)' }}>
                    <span>Chiết khấu Voucher Grape:</span>
                    <span style={{ fontWeight: 700 }}>-{formatPrice(invoiceData.invoice?.discount_amount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(invoiceData.invoice?.shipping_fee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Thuế suất GTGT (VAT 0%):</span>
                  <span>0đ</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0 0',
                  marginTop: '6px',
                  borderTop: '2px solid var(--grape-600)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--grape-800)'
                }}>
                  <span>Tổng Thanh Toán:</span>
                  <span>{formatPrice(invoiceData.invoice?.grand_total)}</span>
                </div>
              </div>
            </div>

            {/* Signatures & Stamp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginTop: '36px', fontSize: '0.84rem' }}>
              <div>
                <strong>Người Mua Hàng</strong><br />
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>(Ký, ghi rõ họ tên)</span>
                <div style={{ marginTop: '40px', fontWeight: 600 }}>{invoiceData.invoice?.customer_name}</div>
              </div>

              <div>
                <strong>Đại Diện Grape Store 🍇</strong><br />
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>(Ký điện tử & Đóng dấu hợp lệ)</span>
                <div style={{
                  display: 'inline-block',
                  margin: '12px auto 0',
                  padding: '6px 12px',
                  border: '2px dashed #10B981',
                  borderRadius: '6px',
                  color: '#059669',
                  fontWeight: 800,
                  fontSize: '0.78rem'
                }}>
                  ✓ ĐÃ KÝ ĐIỆN TỬ BỞI GRAPE STORE E-COMMERCE
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
