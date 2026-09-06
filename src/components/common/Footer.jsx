import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#FFFFFF', marginTop: '60px', borderTop: '4px solid var(--grape-600)' }}>
      {/* Policy Highlights Strip */}
      <div style={{ background: 'var(--grape-50)', padding: '24px 0', borderBottom: '1px solid var(--grape-100)' }}>
        <div className="grape-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--grape-600)', boxShadow: 'var(--shadow-xs)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--grape-900)' }}>100% Chính Hãng</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cam kết hoàn tiền 200% nếu giả</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-500)', boxShadow: 'var(--shadow-xs)' }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--grape-900)' }}>Giao Nhanh Miễn Phí</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Mã FreeShip áp dụng toàn quốc</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--grape-600)', boxShadow: 'var(--shadow-xs)' }}>
                <RotateCcw size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--grape-900)' }}>7 Ngày Đổi Trả</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Đổi trả miễn phí tận nhà</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-500)', boxShadow: 'var(--shadow-xs)' }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--grape-900)' }}>Ưu Đãi Độc Quyền</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Voucher Grape lên đến 100K</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="grape-container" style={{ padding: '40px 16px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', fontSize: '0.85rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--grape-900)', marginBottom: '14px', textTransform: 'uppercase' }}>Chăm Sóc Khách Hàng</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
              <li><a href="#help" onClick={(e) => e.preventDefault()}>Trung Tâm Trợ Giúp</a></li>
              <li><a href="#guide" onClick={(e) => e.preventDefault()}>Hướng Dẫn Mua Hàng</a></li>
              <li><a href="#return" onClick={(e) => e.preventDefault()}>Chính Sách Đổi Trả & Hoàn Tiền</a></li>
              <li><a href="#shipping" onClick={(e) => e.preventDefault()}>Vận Chuyển Grape Express</a></li>
              <li><a href="#contact" onClick={(e) => e.preventDefault()}>Hotline: 1900 8899</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--grape-900)', marginBottom: '14px', textTransform: 'uppercase' }}>Về Grape Store</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
              <li><a href="#about" onClick={(e) => e.preventDefault()}>Giới Thiệu Về Grape Store</a></li>
              <li><a href="#career" onClick={(e) => e.preventDefault()}>Tuyển Dụng Nhân Tài</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Điều Khoản Sàn Grape</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Chính Sách Bảo Mật</a></li>
              <li><a href="#flash" onClick={(e) => e.preventDefault()}>Flash Sale Hàng Ngày</a></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--grape-900)', marginBottom: '14px', textTransform: 'uppercase' }}>Thanh Toán & Vận Chuyển</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {['COD', 'MOMO', 'GRAPEPAY', 'VISA', 'MASTERCARD', 'JCB'].map((p) => (
                <span key={p} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--grape-700)' }}>
                  {p}
                </span>
              ))}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--grape-900)', marginBottom: '8px', textTransform: 'uppercase' }}>Đơn Vị Vận Chuyển</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: 'var(--grape-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--grape-700)' }}>🍇 Grape Express</span>
              <span style={{ background: 'var(--accent-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-600)' }}>⚡ Hỏa Tốc 2H</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--grape-900)', marginBottom: '14px', textTransform: 'uppercase' }}>Tải Ứng Dụng Grape Store</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: 75, height: 75, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                🍇
                <span style={{ fontSize: '0.6rem', color: '#64748B' }}>QR Code</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ background: '#1E1B2E', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem' }}>App Store</span>
                <span style={{ background: '#1E1B2E', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem' }}>Google Play</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '30px', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
          © 2026 GRAPE STORE VIỆT NAM - Thiết kế chuẩn UX/UI E-Commerce Shopee. Tone màu Nho Xanh Lá Shine Muscat (#1B8A5A / #2D6A4F) & Điểm nhấn Cam/Vàng (#FF9E00).
        </div>
      </div>
    </footer>
  );
};
