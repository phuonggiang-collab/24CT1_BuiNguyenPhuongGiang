import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OtpVerification } from './OtpVerification';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('phuonggiang@grape.vn');
  const [password, setPassword] = useState('123456');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(emailOrPhone, password);
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register({
      full_name: fullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });
    setLoading(false);
  };

  return (
    <div className="grape-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '440px', width: '100%', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeAuthModal}>
          <X size={18} />
        </button>

        {authMode === 'otp' ? (
          <OtpVerification onBackToLogin={() => setAuthMode('login')} />
        ) : (
          <div>
            {/* Header with Logo */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🍇</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--grape-900)' }}>
                {authMode === 'login' ? 'Đăng Nhập Grape Store' : 'Đăng Ký Tài Khoản Mới'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {authMode === 'login' ? 'Mua sắm thỏa thích - Ngập tràn ưu đãi' : 'Trải nghiệm mua sắm tiện ích & nhận mã OTP'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              borderRadius: '6px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  background: authMode === 'login' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'login' ? 'var(--grape-700)' : 'var(--text-secondary)',
                  boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  background: authMode === 'register' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'register' ? 'var(--grape-700)' : 'var(--text-secondary)',
                  boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Đăng Ký
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    Email hoặc Số điện thoại
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="VD: phuonggiang@grape.vn"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    Mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 38px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--grape-600), var(--grape-700))',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Họ và tên
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="VD: Bùi Nguyễn Phương Giang"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                    <User size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Địa chỉ Email (Nhận mã OTP)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="VD: yourname@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Số điện thoại
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      placeholder="VD: 0987654321"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                    <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự..."
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                    <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-orange)'
                  }}
                >
                  {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ & NHẬN MÃ OTP 🍇'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
