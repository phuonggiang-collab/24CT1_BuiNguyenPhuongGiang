const db = require('../config/db');

// Tạo mã đơn hàng duy nhất dạng GRP-YYYYMMDD-XXXX
const generateOrderCode = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `GRP-${dateStr}-${randomStr}`;
};

// Tạo đơn hàng mới
exports.createOrder = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const {
      items,
      shipping_address_id,
      custom_address,
      voucher_code,
      payment_method = 'COD',
      notes = ''
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống!' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.products.find(p => p.id === Number(item.product_id));
      if (!product) {
        return res.status(404).json({ success: false, message: `Sản phẩm mã #${item.product_id} không tồn tại` });
      }

      const qty = Number(item.quantity) || 1;
      if (product.stock_quantity < qty) {
        return res.status(400).json({ success: false, message: `Sản phẩm "${product.name}" chỉ còn ${product.stock_quantity} cái trong kho` });
      }

      const itemTotal = product.sale_price * qty;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        image_url: product.image_url,
        quantity: qty,
        unit_price: product.sale_price,
        total_price: itemTotal
      });
    }

    // Xử lý Voucher
    let voucherId = null;
    let discountAmount = 0;
    let shippingFee = 30000;

    if (voucher_code) {
      const voucher = db.vouchers.find(v => v.code.toUpperCase() === voucher_code.trim().toUpperCase());
      if (voucher && voucher.is_active && subtotal >= voucher.min_spend && voucher.used_count < voucher.usage_limit) {
        voucherId = voucher.id;
        if (voucher.discount_type === 'PERCENT') {
          discountAmount = Math.round((subtotal * voucher.discount_value) / 100);
          if (voucher.max_discount && discountAmount > voucher.max_discount) {
            discountAmount = voucher.max_discount;
          }
        } else if (voucher.discount_type === 'FIXED_AMOUNT') {
          discountAmount = voucher.discount_value;
        } else if (voucher.discount_type === 'FREE_SHIPPING') {
          discountAmount = Math.min(voucher.discount_value, shippingFee);
          shippingFee = Math.max(0, shippingFee - voucher.discount_value);
        }

        voucher.used_count += 1;
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + (voucher_code === 'FREESHIP' ? 0 : shippingFee));

    // Xử lý địa chỉ
    let address = null;
    if (shipping_address_id) {
      address = db.addresses.find(a => a.id === Number(shipping_address_id));
    }
    if (!address && custom_address) {
      address = {
        id: db.addresses.length + 1,
        user_id: userId,
        receiver_name: custom_address.receiver_name || req.user?.full_name || 'Khách hàng Grape',
        phone: custom_address.phone || req.user?.phone || '0987654321',
        detailed_address: custom_address.detailed_address,
        is_default: false,
        created_at: new Date()
      };
      db.addresses.push(address);
    }
    if (!address) {
      address = db.addresses.find(a => a.user_id === userId) || db.addresses[0];
    }

    const newOrderId = db.orders.length + 1;
    const orderCode = generateOrderCode();

    const newOrder = {
      id: newOrderId,
      order_code: orderCode,
      user_id: userId,
      shipping_address_id: address ? address.id : 1,
      voucher_id: voucherId,
      subtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method,
      payment_status: payment_method === 'COD' ? 'PENDING' : 'PAID',
      status: 'PENDING',
      notes,
      order_date: new Date(),
      updated_at: new Date()
    };

    db.orders.unshift(newOrder);

    // Lưu chi tiết các item
    validatedItems.forEach(item => {
      db.order_items.push({
        id: db.order_items.length + 1,
        order_id: newOrderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      });

      // Cập nhật tồn kho & số lượng đã bán
      const p = db.products.find(prod => prod.id === item.product_id);
      if (p) {
        p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
        p.sold_quantity += item.quantity;
      }
    });

    // Tạo nhật ký Timeline tiến trình ban đầu
    db.order_timeline_logs.push({
      id: db.order_timeline_logs.length + 1,
      order_id: newOrderId,
      status: 'PENDING',
      title: 'Đặt hàng thành công',
      description: `Đơn hàng #${orderCode} đã được tạo với phương thức thanh toán ${payment_method}`,
      timestamp: new Date()
    });

    // Tự động sinh Hóa đơn điện tử liên kết
    const newInvoice = {
      id: db.invoices.length + 1,
      invoice_number: `INV-2026-${String(newOrderId).padStart(5, '0')}`,
      order_id: newOrderId,
      customer_name: address.receiver_name,
      customer_phone: address.phone,
      customer_email: req.user?.email || 'customer@grape.vn',
      shipping_address: `${address.detailed_address}, ${address.ward || ''}, ${address.district || ''}, ${address.province || ''}`,
      tax_code: '0318999999',
      subtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      vat_amount: 0,
      grand_total: totalAmount,
      issued_date: new Date(),
      is_exported: true
    };
    db.invoices.push(newInvoice);

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Grape Store 🍇',
      order: newOrder,
      invoice: newInvoice
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách đơn hàng của người dùng (hỗ trợ lọc theo tab trạng thái)
exports.getUserOrders = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const { status } = req.query;

    let userOrders = db.orders.filter(o => o.user_id === userId);

    if (status && status !== 'ALL') {
      userOrders = userOrders.filter(o => o.status === status);
    }

    userOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

    // Ghép nối thông tin chi tiết item và sản phẩm
    const ordersWithDetails = userOrders.map(order => {
      const items = db.order_items
        .filter(item => item.order_id === order.id)
        .map(item => {
          const product = db.products.find(p => p.id === item.product_id);
          return {
            ...item,
            product_name: product ? product.name : 'Sản phẩm',
            product_image: product ? product.image_url : '',
            product_slug: product ? product.slug : ''
          };
        });

      const address = db.addresses.find(a => a.id === order.shipping_address_id);
      const invoice = db.invoices.find(inv => inv.order_id === order.id);

      return {
        ...order,
        items,
        address,
        invoice_number: invoice ? invoice.invoice_number : null
      };
    });

    return res.status(200).json({
      success: true,
      count: ordersWithDetails.length,
      orders: ordersWithDetails
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Chi tiết đơn hàng và Timeline tracking tiến trình
exports.getOrderDetail = (req, res) => {
  try {
    const { id } = req.params;
    const order = db.orders.find(o => o.id === Number(id) || o.order_code === id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    const items = db.order_items
      .filter(item => item.order_id === order.id)
      .map(item => {
        const product = db.products.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product ? product.name : 'Sản phẩm',
          product_image: product ? product.image_url : ''
        };
      });

    const address = db.addresses.find(a => a.id === order.shipping_address_id);
    const timeline = db.order_timeline_logs
      .filter(log => log.order_id === order.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const invoice = db.invoices.find(inv => inv.order_id === order.id);

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        items,
        address,
        timeline,
        invoice
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hủy đơn hàng (nếu đang ở PENDING)
exports.cancelOrder = (req, res) => {
  try {
    const { id } = req.params;
    const order = db.orders.find(o => o.id === Number(id));

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn khi đơn hàng đang ở trạng thái Chờ xác nhận!' });
    }

    order.status = 'CANCELLED';
    order.updated_at = new Date();

    db.order_timeline_logs.push({
      id: db.order_timeline_logs.length + 1,
      order_id: order.id,
      status: 'CANCELLED',
      title: 'Đơn hàng đã hủy',
      description: 'Đơn hàng đã được hủy theo yêu cầu của khách hàng',
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Hủy đơn hàng thành công!',
      order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
