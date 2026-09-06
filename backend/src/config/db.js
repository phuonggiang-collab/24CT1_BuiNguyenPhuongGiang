const bcrypt = require('bcryptjs');

// In-Memory Database Store for Instant Execution & Real-time Persistence
const db = {
  users: [
    {
      id: 1,
      full_name: 'Bùi Nguyễn Phương Giang',
      email: 'phuonggiang@grape.vn',
      phone: '0987654321',
      password_hash: bcrypt.hashSync('123456', 8),
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_verified: true,
      role: 'CUSTOMER',
      created_at: new Date('2026-01-01T08:00:00Z')
    },
    {
      id: 2,
      full_name: 'Admin Grape Store',
      email: 'admin@grape.vn',
      phone: '0901234567',
      password_hash: bcrypt.hashSync('admin123', 8),
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      is_verified: true,
      role: 'ADMIN',
      created_at: new Date('2026-01-01T08:00:00Z')
    }
  ],

  otp_logs: [],

  addresses: [
    {
      id: 1,
      user_id: 1,
      receiver_name: 'Bùi Nguyễn Phương Giang',
      phone: '0987654321',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      detailed_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ',
      is_default: true,
      created_at: new Date()
    },
    {
      id: 2,
      user_id: 1,
      receiver_name: 'Bùi Phương Giang (Văn phòng)',
      phone: '0987654321',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu',
      detailed_address: '123 Đường Nam Kỳ Khởi Nghĩa',
      is_default: false,
      created_at: new Date()
    }
  ],

  categories: [
    { id: 1, name: 'Thời Trang Nữ', slug: 'thoi-trang-nu', icon: '👗', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300' },
    { id: 2, name: 'Công Nghệ & Phụ Kiện', slug: 'cong-nghe', icon: '📱', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300' },
    { id: 3, name: 'Mỹ Phẩm & Skincare', slug: 'my-pham', icon: '💄', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300' },
    { id: 4, name: 'Thời Trang Nam', slug: 'thoi-trang-nam', icon: '👕', image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300' },
    { id: 5, name: 'Giày Dép & Túi Ví', slug: 'giay-dep-tui', icon: '👟', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
    { id: 6, name: 'Đồ Gia Dụng Thông Minh', slug: 'gia-dung', icon: '🏠', image_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300' },
    { id: 7, name: 'Bách Hóa & Đồ Ăn', slug: 'bach-hoa', icon: '🍇', image_url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300' },
    { id: 8, name: 'Đồng Hồ & Trang Sức', slug: 'trang-suc', icon: '⌚', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' }
  ],

  products: [
    {
      id: 1,
      category_id: 2,
      name: 'Tai Nghe Bluetooth GrapePods Pro 2026 - Chống Ồn ANC, Âm Bass Trầm Sâu Tone Nho Xanh',
      slug: 'tai-nghe-bluetooth-grapepods-pro-2026',
      description: 'Tai nghe True Wireless cao cấp phiên bản Green Grape Edition độc quyền. Khử tiếng ồn chủ động ANC 45dB, Bluetooth 5.4, pin 36 tiếng, chuẩn kháng nước IPX5.',
      original_price: 1290000,
      sale_price: 690000,
      stock_quantity: 145,
      sold_quantity: 1289,
      rating_avg: 4.9,
      rating_count: 512,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-10')
    },
    {
      id: 2,
      category_id: 1,
      name: 'Đầm Nữ Voan Tơ Hoa Nhí Vintage Dáng Xòe - Màu Xanh Bơ Pastel Thanh Lịch',
      slug: 'dam-nu-voan-to-hoa-nhi-vintage',
      description: 'Váy đầm nữ phong cách Hàn Quốc dịu dàng, chất liệu voan tơ cao cấp 2 lớp mềm mại mát mẻ mùa hè. Phù hợp dạo phố, đi tiệc, chụp ảnh kỷ niệm.',
      original_price: 550000,
      sale_price: 299000,
      stock_quantity: 80,
      sold_quantity: 840,
      rating_avg: 4.8,
      rating_count: 240,
      image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-12')
    },
    {
      id: 3,
      category_id: 3,
      name: 'Serum Dưỡng Trắng & Mờ Thâm Nho Xanh Grape Brightening C 30ml',
      slug: 'serum-duong-trang-grape-brightening-c',
      description: 'Chiết xuất 85% từ hạt nho xanh hữu cơ Pháp kết hợp Vitamin C thế hệ mới và Niacinamide 5%. Giúp làn da căng bóng, đều màu và chống lão hóa vượt trội.',
      original_price: 480000,
      sale_price: 289000,
      stock_quantity: 210,
      sold_quantity: 3420,
      rating_avg: 5.0,
      rating_count: 1420,
      image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-15')
    },
    {
      id: 4,
      category_id: 2,
      name: 'Đồng Hồ Thông Minh Grape Watch Ultra 2 - Màn Hình AMOLED 1.95 inch, Đo Nhịp Tim & SpO2',
      slug: 'dong-ho-thong-minh-grape-watch-ultra-2',
      description: 'Smartwatch thế hệ 2026 viền Titanium siêu nhẹ, tích hợp hơn 100 chế độ thể thao, nghe gọi Bluetooth trực tiếp và theo dõi giấc ngủ chuẩn xác.',
      original_price: 1890000,
      sale_price: 1150000,
      stock_quantity: 65,
      sold_quantity: 480,
      rating_avg: 4.8,
      rating_count: 195,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
      ],
      is_flash_sale: false,
      is_featured: true,
      created_at: new Date('2026-02-18')
    },
    {
      id: 5,
      category_id: 5,
      name: 'Giày Sneaker Unisex Grape Dynamic Runner - Đế Đệm Khí Êm Chân, Co Giãn Thoáng Khí',
      slug: 'giay-sneaker-unisex-grape-dynamic-runner',
      description: 'Thiết kế thể thao năng động, trọng lượng chỉ 280g. Phù hợp cho chạy bộ, tập gym hoặc đi làm hằng ngày. Họa tiết điểm nhấn màu cam nổi bật.',
      original_price: 850000,
      sale_price: 460000,
      stock_quantity: 112,
      sold_quantity: 920,
      rating_avg: 4.7,
      rating_count: 310,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-20')
    },
    {
      id: 6,
      category_id: 4,
      name: 'Áo Khoác Bomber Nam Nữ Unisex Grape Windbreaker 2 Lớp Chống Nước',
      slug: 'ao-khoac-bomber-unisex-grape-windbreaker',
      description: 'Chất vải dù gió kháng nước nhẹ, lót dù bên trong thoáng khí. Thiết kế trẻ trung, form rộng thoải mái, khóa kéo kim loại cao cấp dập logo nho.',
      original_price: 490000,
      sale_price: 295000,
      stock_quantity: 90,
      sold_quantity: 670,
      rating_avg: 4.8,
      rating_count: 220,
      image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'
      ],
      is_flash_sale: false,
      is_featured: true,
      created_at: new Date('2026-02-21')
    },
    {
      id: 7,
      category_id: 6,
      name: 'Nồi Chiên Không Dầu Điện Tử Grape AirFryer 6.5L - Cảm Ứng 8 Chế Độ Nấu',
      slug: 'noi-chien-khong-dau-grape-airfryer-6-5l',
      description: 'Công nghệ Rapid Air giảm 85% lượng dầu mỡ thừa. Lòng nồi phủ chống dính Teflon cao cấp, kính quan sát thực phẩm trong suốt tiện lợi.',
      original_price: 2190000,
      sale_price: 1350000,
      stock_quantity: 45,
      sold_quantity: 310,
      rating_avg: 4.9,
      rating_count: 140,
      image_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600',
      images: [
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600'
      ],
      is_flash_sale: false,
      is_featured: false,
      created_at: new Date('2026-02-22')
    },
    {
      id: 8,
      category_id: 7,
      name: 'Nho Mẫu Đơn Shine Muscat Nhập Khẩu Thượng Hạng (Hộp 1kg Quà Tặng)',
      slug: 'nho-mau-don-shine-muscat-1kg',
      description: 'Nho mẫu đơn cao cấp ngọt thanh thơm hương sữa, quả to tròn mọng nước không hạt. Đóng gói hộp quà sang trọng kèm túi giữ nhiệt cao cấp.',
      original_price: 650000,
      sale_price: 450000,
      stock_quantity: 50,
      sold_quantity: 1100,
      rating_avg: 5.0,
      rating_count: 480,
      image_url: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600',
      images: [
        'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-23')
    },
    {
      id: 9,
      category_id: 1,
      name: 'Áo Thun Nữ Form Rộng Cotton 100% In Hình Grape Juice Vintage',
      slug: 'ao-thun-nu-cotton-grape-juice',
      description: 'Chất liệu 100% cotton 2 chiều định lượng 250gsm dày dặn, co giãn thấm hút mồ hôi cực tốt. Hình in kỹ thuật số sắc nét không bong tróc.',
      original_price: 250000,
      sale_price: 139000,
      stock_quantity: 180,
      sold_quantity: 2150,
      rating_avg: 4.8,
      rating_count: 730,
      image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600'
      ],
      is_flash_sale: false,
      is_featured: true,
      created_at: new Date('2026-02-24')
    },
    {
      id: 10,
      category_id: 8,
      name: 'Dây Chuyền Bạc Ý S925 Đính Đá Ngọc Bích Xanh Nho Grape Emerald',
      slug: 'day-chuyen-bac-y-grape-emerald',
      description: 'Dây chuyền bạc cao cấp mạ bạch kim sáng bóng kết hợp mặt đá ngọc bích xanh tự nhiên giác cắt tinh xảo. Tôn lên nét thanh lịch quý phái cho phái đẹp.',
      original_price: 790000,
      sale_price: 490000,
      stock_quantity: 40,
      sold_quantity: 320,
      rating_avg: 4.9,
      rating_count: 110,
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
      ],
      is_flash_sale: false,
      is_featured: false,
      created_at: new Date('2026-02-25')
    },
    {
      id: 11,
      category_id: 2,
      name: 'Bàn Phím Cơ Không Dây Grape Mechanical Pro - Switch Xanh Silent Êm Ái, LED RGB',
      slug: 'ban-phim-co-khong-day-grape-mechanical-pro',
      description: 'Bàn phím cơ 3 chế độ kết nối (Type-C, Bluetooth 5.0, 2.4Ghz). Custom Hot-swap 5 pin, keycap PBT Doubleshot chống mòn, pin sạc 4000mAh dùng 3 tháng.',
      original_price: 1590000,
      sale_price: 990000,
      stock_quantity: 75,
      sold_quantity: 580,
      rating_avg: 4.9,
      rating_count: 215,
      image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'
      ],
      is_flash_sale: true,
      is_featured: true,
      created_at: new Date('2026-02-26')
    },
    {
      id: 12,
      category_id: 3,
      name: 'Kem Chống Nắng Phổ Rộng Grape UV Shield SPF50+ PA++++ Kiềm Dầu Nâng Tông',
      slug: 'kem-chong-nang-grape-uv-shield',
      description: 'Công nghệ màng lọc thông minh chống tia UVA/UVB và ánh sáng xanh. Không vệt trắng, thấm nhanh trong 10 giây, nâng tông tự nhiên rạng rỡ.',
      original_price: 380000,
      sale_price: 219000,
      stock_quantity: 300,
      sold_quantity: 4500,
      rating_avg: 4.9,
      rating_count: 1890,
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'
      ],
      is_flash_sale: false,
      is_featured: true,
      created_at: new Date('2026-02-27')
    }
  ],

  vouchers: [
    {
      id: 1,
      code: 'GRAPE50K',
      title: 'Giảm 50.000đ cho đơn từ 300.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 50000,
      min_spend: 300000,
      max_discount: 50000,
      usage_limit: 500,
      used_count: 89,
      end_date: new Date('2026-12-31'),
      is_active: true
    },
    {
      id: 2,
      code: 'FREESHIP',
      title: 'Miễn phí vận chuyển (Tối đa 30.000đ) cho đơn từ 150.000đ',
      discount_type: 'FREE_SHIPPING',
      discount_value: 30000,
      min_spend: 150000,
      max_discount: 30000,
      usage_limit: 1000,
      used_count: 340,
      end_date: new Date('2026-12-31'),
      is_active: true
    },
    {
      id: 3,
      code: 'GRAPE15',
      title: 'Giảm 15% tối đa 100.000đ cho đơn từ 200.000đ',
      discount_type: 'PERCENT',
      discount_value: 15,
      min_spend: 200000,
      max_discount: 100000,
      usage_limit: 300,
      used_count: 142,
      end_date: new Date('2026-12-31'),
      is_active: true
    },
    {
      id: 4,
      code: 'CHAOHE2026',
      title: 'Giảm 30.000đ cho mọi đơn từ 100.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 30000,
      min_spend: 100000,
      max_discount: 30000,
      usage_limit: 800,
      used_count: 210,
      end_date: new Date('2026-12-31'),
      is_active: true
    },
    {
      id: 5,
      code: 'VIPGRAPE',
      title: 'Voucher Khách Hàng VIP: Giảm 100.000đ cho đơn từ 500.000đ',
      discount_type: 'FIXED_AMOUNT',
      discount_value: 100000,
      min_spend: 500000,
      max_discount: 100000,
      usage_limit: 150,
      used_count: 45,
      end_date: new Date('2026-12-31'),
      is_active: true
    }
  ],

  orders: [
    {
      id: 1,
      order_code: 'GRP-20260301-8912',
      user_id: 1,
      shipping_address_id: 1,
      voucher_id: 1,
      subtotal: 690000,
      discount_amount: 50000,
      shipping_fee: 30000,
      total_amount: 670000,
      payment_method: 'COD',
      payment_status: 'PENDING',
      status: 'SHIPPING',
      notes: 'Giao giờ hành chính giúp mình nhé!',
      order_date: new Date('2026-03-01T09:30:00Z'),
      updated_at: new Date('2026-03-02T14:20:00Z')
    },
    {
      id: 2,
      order_code: 'GRP-20260228-4321',
      user_id: 1,
      shipping_address_id: 1,
      voucher_id: 2,
      subtotal: 739000,
      discount_amount: 30000,
      shipping_fee: 30000,
      total_amount: 739000,
      payment_method: 'MOMO',
      payment_status: 'PAID',
      status: 'DELIVERED',
      notes: '',
      order_date: new Date('2026-02-28T11:15:00Z'),
      updated_at: new Date('2026-03-02T10:00:00Z')
    }
  ],

  order_items: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 1,
      unit_price: 690000,
      total_price: 690000
    },
    {
      id: 2,
      order_id: 2,
      product_id: 3,
      quantity: 1,
      unit_price: 289000,
      total_price: 289000
    },
    {
      id: 3,
      order_id: 2,
      product_id: 8,
      quantity: 1,
      unit_price: 450000,
      total_price: 450000
    }
  ],

  order_timeline_logs: [
    {
      id: 1,
      order_id: 1,
      status: 'PENDING',
      title: 'Đơn hàng đã được tạo',
      description: 'Khách hàng đặt đơn hàng thành công qua Grape Store App',
      timestamp: new Date('2026-03-01T09:30:00Z')
    },
    {
      id: 2,
      order_id: 1,
      status: 'PROCESSING',
      title: 'Người bán đang chuẩn bị hàng',
      description: 'Kho tổng Grape Store (TP.HCM) đã in phiếu gửi và đóng gói sản phẩm cẩn thận',
      timestamp: new Date('2026-03-01T14:10:00Z')
    },
    {
      id: 3,
      order_id: 1,
      status: 'SHIPPING',
      title: 'Đang vận chuyển giao đến bạn',
      description: 'Bưu tá Grape Express (Nguyễn Văn Hùng - SĐT 0918.xxx.888) đang trên đường giao hàng',
      timestamp: new Date('2026-03-02T08:45:00Z')
    },
    {
      id: 4,
      order_id: 2,
      status: 'PENDING',
      title: 'Đơn hàng đã được tạo',
      description: 'Đơn hàng thanh toán thành công qua Ví điện tử MoMo',
      timestamp: new Date('2026-02-28T11:15:00Z')
    },
    {
      id: 5,
      order_id: 2,
      status: 'PROCESSING',
      title: 'Shop đã xác nhận đơn hàng',
      description: 'Hàng đã được chuyển sang bưu cục trung chuyển',
      timestamp: new Date('2026-02-28T16:00:00Z')
    },
    {
      id: 6,
      order_id: 2,
      status: 'SHIPPING',
      title: 'Đang giao hàng',
      description: 'Tài xế giao hàng chặng cuối đang liên hệ',
      timestamp: new Date('2026-03-01T10:00:00Z')
    },
    {
      id: 7,
      order_id: 2,
      status: 'DELIVERED',
      title: 'Giao hàng thành công',
      description: 'Kiện hàng đã được ký nhận bởi khách hàng Bùi Nguyễn Phương Giang',
      timestamp: new Date('2026-03-02T10:00:00Z')
    }
  ],

  invoices: [
    {
      id: 1,
      invoice_number: 'INV-2026-00109',
      order_id: 1,
      customer_name: 'Bùi Nguyễn Phương Giang',
      customer_phone: '0987654321',
      customer_email: 'phuonggiang@grape.vn',
      shipping_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      tax_code: '0318999999',
      subtotal: 690000,
      discount_amount: 50000,
      shipping_fee: 30000,
      vat_amount: 0,
      grand_total: 670000,
      issued_date: new Date('2026-03-01T09:35:00Z'),
      is_exported: true
    },
    {
      id: 2,
      invoice_number: 'INV-2026-00108',
      order_id: 2,
      customer_name: 'Bùi Nguyễn Phương Giang',
      customer_phone: '0987654321',
      customer_email: 'phuonggiang@grape.vn',
      shipping_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      tax_code: '0318999999',
      subtotal: 739000,
      discount_amount: 30000,
      shipping_fee: 30000,
      vat_amount: 0,
      grand_total: 739000,
      issued_date: new Date('2026-02-28T11:20:00Z'),
      is_exported: true
    }
  ]
};

module.exports = db;
