const db = require('../config/db');

// Lấy danh sách Voucher còn hiệu lực
exports.getVouchers = (req, res) => {
  try {
    const now = new Date();
    const activeVouchers = db.vouchers
      .filter(v => v.is_active && new Date(v.end_date) > now && v.used_count < v.usage_limit)
      .map(v => ({
        ...v,
        remaining_uses: v.usage_limit - v.used_count
      }));

    return res.status(200).json({
      success: true,
      count: activeVouchers.length,
      vouchers: activeVouchers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Kiểm tra và áp dụng mã giảm giá
exports.applyVoucher = (req, res) => {
  try {
    const { code, subtotal, shipping_fee = 30000 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã Voucher' });
    }

    const voucher = db.vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase());

    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Mã Voucher không tồn tại!' });
    }

    if (!voucher.is_active || new Date(voucher.end_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Mã Voucher đã hết hạn sử dụng!' });
    }

    if (voucher.used_count >= voucher.usage_limit) {
      return res.status(400).json({ success: false, message: 'Mã Voucher đã hết lượt sử dụng!' });
    }

    const orderSubtotal = Number(subtotal) || 0;

    if (orderSubtotal < voucher.min_spend) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${voucher.min_spend.toLocaleString('vi-VN')}đ để sử dụng mã này!`
      });
    }

    let discountAmount = 0;
    let finalShippingFee = Number(shipping_fee);

    if (voucher.discount_type === 'PERCENT') {
      discountAmount = Math.round((orderSubtotal * voucher.discount_value) / 100);
      if (voucher.max_discount && discountAmount > voucher.max_discount) {
        discountAmount = voucher.max_discount;
      }
    } else if (voucher.discount_type === 'FIXED_AMOUNT') {
      discountAmount = voucher.discount_value;
    } else if (voucher.discount_type === 'FREE_SHIPPING') {
      discountAmount = Math.min(voucher.discount_value, finalShippingFee);
      finalShippingFee = Math.max(0, finalShippingFee - voucher.discount_value);
    }

    // Đảm bảo không giảm quá tổng giá trị đơn
    discountAmount = Math.min(discountAmount, orderSubtotal);
    const totalAmount = Math.max(0, orderSubtotal - discountAmount + (voucher.discount_type === 'FREE_SHIPPING' ? finalShippingFee : Number(shipping_fee)));

    return res.status(200).json({
      success: true,
      message: `Áp dụng mã ${voucher.code} thành công! Giảm ${discountAmount.toLocaleString('vi-VN')}đ`,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        title: voucher.title,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value
      },
      discountAmount,
      shippingFee: voucher.discount_type === 'FREE_SHIPPING' ? finalShippingFee : Number(shipping_fee),
      subtotal: orderSubtotal,
      totalAmount
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
