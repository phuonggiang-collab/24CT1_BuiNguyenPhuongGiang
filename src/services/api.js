const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('grape_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth & OTP
  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyOtp: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  resendOtp: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  addAddress: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Products & Categories
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`);
    return res.json();
  },

  searchProducts: async (q) => {
    const res = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(q)}`);
    return res.json();
  },

  getRecommendations: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products/recommendations?${query}`);
    return res.json();
  },

  getFlashSale: async () => {
    const res = await fetch(`${API_BASE_URL}/products/flash-sale`);
    return res.json();
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    return res.json();
  },

  getProductDetail: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return res.json();
  },

  // Vouchers
  getVouchers: async () => {
    const res = await fetch(`${API_BASE_URL}/vouchers`);
    return res.json();
  },

  applyVoucher: async (code, subtotal, shipping_fee) => {
    const res = await fetch(`${API_BASE_URL}/vouchers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal, shipping_fee })
    });
    return res.json();
  },

  // Orders
  createOrder: async (data) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getUserOrders: async (status = 'ALL') => {
    const res = await fetch(`${API_BASE_URL}/orders?status=${status}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getOrderDetail: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  cancelOrder: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Invoices
  getInvoiceByOrder: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/invoices/order/${orderId}`);
    return res.json();
  }
};
