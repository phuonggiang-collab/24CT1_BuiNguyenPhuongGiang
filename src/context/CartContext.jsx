import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grape_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: 'Tai Nghe Bluetooth GrapePods Pro 2026 - Chống Ồn ANC, Âm Bass Trầm Sâu Tone Nho Xanh',
          sale_price: 690000,
          original_price: 1290000,
          image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
          quantity: 1,
          stock_quantity: 145
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [selectedItemIds, setSelectedItemIds] = useState(() => {
    return [1]; // Mặc định chọn sản phẩm đầu tiên
  });

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Lưu cart vào LocalStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('grape_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity || 99) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            sale_price: product.sale_price,
            original_price: product.original_price,
            image_url: product.image_url,
            quantity,
            stock_quantity: product.stock_quantity
          }
        ];
      }
    });

    // Tự động tích chọn sản phẩm vừa thêm
    if (!selectedItemIds.includes(product.id)) {
      setSelectedItemIds(prev => [...prev, product.id]);
    }

    addToast(`Đã thêm "${product.name.slice(0, 30)}..." vào giỏ hàng 🍇`, 'success');
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    setSelectedItemIds(prev => prev.filter(id => id !== productId));
    addToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const toggleSelectItem = (productId) => {
    setSelectedItemIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map(item => item.id));
    }
  };

  // Tính toán tổng tiền của các sản phẩm được chọn
  const selectedItems = useMemo(() => {
    return cartItems.filter(item => selectedItemIds.includes(item.id));
  }, [cartItems, selectedItemIds]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.sale_price * item.quantity, 0);
  }, [selectedItems]);

  const standardShippingFee = 30000;

  // Tính toán giảm giá từ Voucher
  const { discountAmount, shippingFee, totalAmount } = useMemo(() => {
    let discount = 0;
    let shipFee = selectedItems.length > 0 ? standardShippingFee : 0;

    if (appliedVoucher && subtotal >= (appliedVoucher.min_spend || 0)) {
      if (appliedVoucher.discount_type === 'PERCENT') {
        discount = Math.round((subtotal * appliedVoucher.discount_value) / 100);
        if (appliedVoucher.max_discount && discount > appliedVoucher.max_discount) {
          discount = appliedVoucher.max_discount;
        }
      } else if (appliedVoucher.discount_type === 'FIXED_AMOUNT') {
        discount = appliedVoucher.discount_value;
      } else if (appliedVoucher.discount_type === 'FREE_SHIPPING') {
        discount = Math.min(appliedVoucher.discount_value, shipFee);
        shipFee = Math.max(0, shipFee - appliedVoucher.discount_value);
      }
    }

    discount = Math.min(discount, subtotal);
    const finalTotal = Math.max(0, subtotal - discount + shipFee);

    return { discountAmount: discount, shippingFee: shipFee, totalAmount: finalTotal };
  }, [subtotal, appliedVoucher, selectedItems.length]);

  const applyVoucherCode = async (code) => {
    try {
      const res = await api.applyVoucher(code, subtotal, standardShippingFee);
      if (res.success) {
        setAppliedVoucher(res.voucher);
        addToast(res.message, 'success');
        setIsVoucherModalOpen(false);
        return { success: true };
      } else {
        addToast(res.message || 'Mã không hợp lệ', 'error');
        return { success: false, message: res.message };
      }
    } catch (e) {
      addToast('Lỗi khi áp dụng mã voucher', 'error');
      return { success: false, message: e.message };
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    addToast('Đã gỡ mã giảm giá', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItemIds([]);
    setAppliedVoucher(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItemIds,
        selectedItems,
        totalItemsCount: cartItems.reduce((s, i) => s + i.quantity, 0),
        selectedCount: selectedItems.length,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        appliedVoucher,
        isVoucherModalOpen,
        isCheckoutOpen,
        setIsVoucherModalOpen,
        setIsCheckoutOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleSelectItem,
        toggleSelectAll,
        applyVoucherCode,
        removeVoucher,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
