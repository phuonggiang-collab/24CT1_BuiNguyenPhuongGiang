import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('grape_token') || null);
  const [loading, setLoading] = useState(true);

  // Auth & OTP Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [otpSession, setOtpSession] = useState(null); // { userId, email, phone, previewOtp }
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Load User profile from token on mount
  useEffect(() => {
    const initUser = async () => {
      const savedToken = localStorage.getItem('grape_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (e) {
          logout();
        }
      } else {
        // Khởi tạo tài khoản demo mặc định cho trải nghiệm tốt nhất
        setUser({
          id: 1,
          full_name: 'Bùi Nguyễn Phương Giang',
          email: 'phuonggiang@grape.vn',
          phone: '0987654321',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: 'CUSTOMER',
          is_verified: true,
          addresses: [
            {
              id: 1,
              receiver_name: 'Bùi Nguyễn Phương Giang',
              phone: '0987654321',
              province: 'TP. Hồ Chí Minh',
              district: 'Quận 1',
              ward: 'Phường Bến Nghé',
              detailed_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ',
              is_default: true
            }
          ]
        });
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (emailOrPhone, password) => {
    try {
      const res = await api.login({ emailOrPhone, password });
      if (res.success) {
        localStorage.setItem('grape_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
        addToast(`Xin chào mừng ${res.user.full_name}! 🍇`, 'success');
        return { success: true };
      } else if (res.requiresOtp) {
        setOtpSession({
          userId: res.userId,
          email: res.email,
          previewOtp: res.previewOtp
        });
        setAuthMode('otp');
        addToast('Tài khoản cần xác thực OTP để tiếp tục', 'info');
        return { success: false, requiresOtp: true };
      } else {
        addToast(res.message || 'Đăng nhập thất bại', 'error');
        return { success: false, message: res.message };
      }
    } catch (e) {
      addToast('Lỗi kết nối máy chủ', 'error');
      return { success: false, message: e.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.register(formData);
      if (res.success) {
        setOtpSession({
          userId: res.userId,
          email: res.email,
          phone: res.phone,
          previewOtp: res.previewOtp
        });
        setAuthMode('otp');
        addToast('Đã gửi mã OTP xác thực tài khoản!', 'success');
        return { success: true, previewOtp: res.previewOtp };
      } else {
        addToast(res.message || 'Đăng ký không thành công', 'error');
        return { success: false, message: res.message };
      }
    } catch (e) {
      addToast('Lỗi kết nối máy chủ', 'error');
      return { success: false, message: e.message };
    }
  };

  const verifyOtp = async (otpCode) => {
    try {
      if (!otpSession || !otpSession.userId) {
        addToast('Phiên xác thực đã hết hạn', 'error');
        return { success: false };
      }

      const res = await api.verifyOtp({
        userId: otpSession.userId,
        otp_code: otpCode
      });

      if (res.success) {
        localStorage.setItem('grape_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
        setOtpSession(null);
        addToast('Xác thực OTP thành công! 🍇', 'success');
        return { success: true };
      } else {
        addToast(res.message || 'Mã OTP không hợp lệ', 'error');
        return { success: false, message: res.message };
      }
    } catch (e) {
      addToast('Lỗi kết nối máy chủ', 'error');
      return { success: false, message: e.message };
    }
  };

  const resendOtp = async () => {
    try {
      if (!otpSession || !otpSession.userId) return;
      const res = await api.resendOtp({ userId: otpSession.userId });
      if (res.success) {
        setOtpSession(prev => ({ ...prev, previewOtp: res.previewOtp }));
        addToast('Đã gửi lại mã OTP mới!', 'success');
      }
    } catch (e) {
      addToast('Không thể gửi lại mã OTP', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('grape_token');
    setToken(null);
    setUser(null);
    addToast('Đã đăng xuất khỏi Grape Store', 'info');
  };

  const addAddress = async (addressData) => {
    try {
      const res = await api.addAddress(addressData);
      if (res.success) {
        setUser(prev => ({
          ...prev,
          addresses: res.addresses
        }));
        addToast('Thêm địa chỉ nhận hàng thành công!', 'success');
        return { success: true };
      }
    } catch (e) {
      addToast('Không thể lưu địa chỉ', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        otpSession,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        addAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
