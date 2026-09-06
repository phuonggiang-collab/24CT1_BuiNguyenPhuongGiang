const db = require('../config/db');

// Lấy thông tin chi tiết hóa đơn theo Order ID
exports.getInvoiceByOrderId = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = db.orders.find(o => o.id === Number(orderId) || o.order_code === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng tương ứng' });
    }

    let invoice = db.invoices.find(inv => inv.order_id === order.id);

    // Nếu chưa có hóa đơn (ví dụ đơn cũ), tự động tạo bản ghi hóa đơn
    if (!invoice) {
      const address = db.addresses.find(a => a.id === order.shipping_address_id) || db.addresses[0];
      invoice = {
        id: db.invoices.length + 1,
        invoice_number: `INV-2026-${String(order.id).padStart(5, '0')}`,
        order_id: order.id,
        customer_name: address ? address.receiver_name : 'Khách hàng Grape Store',
        customer_phone: address ? address.phone : '0987654321',
        customer_email: 'customer@grape.vn',
        shipping_address: address ? `${address.detailed_address}, ${address.ward || ''}, ${address.district || ''}, ${address.province || ''}` : 'TP. Hồ Chí Minh',
        tax_code: '0318999999',
        subtotal: order.subtotal,
        discount_amount: order.discount_amount,
        shipping_fee: order.shipping_fee,
        vat_amount: 0,
        grand_total: order.total_amount,
        issued_date: order.order_date || new Date(),
        is_exported: true
      };
      db.invoices.push(invoice);
    }

    const items = db.order_items
      .filter(item => item.order_id === order.id)
      .map(item => {
        const product = db.products.find(p => p.id === item.product_id);
        return {
          id: item.id,
          product_name: product ? product.name : 'Sản phẩm',
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        };
      });

    const storeInfo = {
      store_name: 'CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ GRAPE STORE VIỆT NAM',
      brand_name: 'GRAPE STORE 🍇',
      slogan: 'Nâng tầm phong cách sống - Mua sắm tiện ích chuẩn Shopee',
      tax_code: '0318999999',
      hotline: '1900 8899 (8h00 - 21h00)',
      email: 'cskh@grapestore.vn',
      website: 'https://grapestore.vn',
      headquarters: 'Tầng 18, Tòa nhà Grape Tower, 128 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh'
    };

    return res.status(200).json({
      success: true,
      storeInfo,
      invoice,
      order: {
        order_code: order.order_code,
        order_date: order.order_date,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        status: order.status
      },
      items
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
