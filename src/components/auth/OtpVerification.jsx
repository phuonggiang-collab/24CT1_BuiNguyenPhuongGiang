import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RotateCcw, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OtpVerification = ({ onBackToLogin }) => {
  const { otpSession, verifyOtp, resendOtp } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus ô đầu tiên khi mở modal
    inputRefs.current[0]?.focus();

    // Đồng hồ đếm ngược 60s
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSession]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tự động submit khi nhập đủ 6 số
    if (newDigits.every(d => d !== '') && index === 5) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);

    if (pasteData.length === 6) {
      handleVerify(pasteData);
    } else {
      inputRefs.current[pasteData.length]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6) return;

    setSubmitting(true);
    await verifyOtp(code);
    setSubmitting(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setDigits(['', '', '', '', '', '']);
    setCountdown(60);
    setCanResend(false);
    resendOtp();
    inputRefs.current[0]?.focus();
  };

  const handleQuickFill = () => {
    if (otpSession?.previewOtp) {
      const codeArr = otpSession.previewOtp.split('');
      setDigits(codeArr);
      handleVerify(otpSession.previewOtp);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <button
        onClick={onBackToLogin}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Quay lại</span>
      </button>

      <div style={{
        width: 54,
        height: 54,
        borderRadius: '50%',
        background: 'var(--grape-100)',
        color: 'var(--grape-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 14px'
      }}>
        <ShieldCheck size={32} />
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--grape-900)', marginBottom: '6px' }}>
        Xác Thực Mã OTP 🍇
      </h2>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Vui lòng nhập mã xác thực 6 chữ số vừa được gửi tới:
      </p>

      <div style={{ fontWeight: 700, color: 'var(--grape-700)', fontSize: '0.95rem', marginBottom: '14px' }}>
        {otpSession?.email || otpSession?.phone || 'customer@grape.vn'}
      </div>

      {/* Demo Code Hint Pill */}
      {otpSession?.previewOtp && (
        <div
          onClick={handleQuickFill}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--accent-50)',
            border: '1px solid var(--accent-300)',
            color: 'var(--accent-700)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px'
          }}
          title="Bấm để tự động điền mã demo"
        >
          <KeyRound size={14} />
          <span>Mã OTP Demo: {otpSession.previewOtp} (Click để điền nhanh)</span>
        </div>
      )}

      {/* 6 Digit Inputs */}
      <div className="otp-inputs-grid" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={el => inputRefs.current[idx] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="otp-digit-box"
          />
        ))}
      </div>

      {/* Countdown & Resend Button */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        {canResend ? (
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--grape-600)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={14} /> Gửi lại mã OTP mới
          </button>
        ) : (
          <span>Gửi lại mã sau <strong style={{ color: 'var(--accent-600)' }}>{countdown}s</strong></span>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => handleVerify()}
        disabled={submitting || digits.some(d => d === '')}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, var(--grape-600), var(--grape-700))',
          color: '#FFFFFF',
          border: 'none',
          padding: '12px',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: digits.every(d => d !== '') ? 'pointer' : 'not-allowed',
          opacity: digits.every(d => d !== '') ? 1 : 0.6
        }}
      >
        {submitting ? 'Đang xác thực...' : 'Xác Nhận & Kích Hoạt Tài Khoản'}
      </button>
    </div>
  );
};
