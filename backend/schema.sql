-- ==========================================================
-- GRAPE STORE E-COMMERCE DATABASE SCHEMA (POSTGRESQL / MYSQL)
-- BRAND IDENTITY: Tone Tím Nho (#7B2CBF) & Cam/Vàng (#FF9E00)
-- ==========================================================

-- 1. BẢNG USERS (Người dùng hệ thống)
DROP TABLE IF EXISTS order_timeline_logs CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS otp_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'SELLER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG OTP_LOGS (Lịch sử sinh & xác thực mã OTP)
CREATE TABLE otp_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    type VARCHAR(30) DEFAULT 'REGISTER_VERIFY' CHECK (type IN ('REGISTER_VERIFY', 'FORGOT_PASSWORD', 'LOGIN_2FA')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ADDRESSES (Địa chỉ giao hàng của User)
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    detailed_address VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG CATEGORIES (Danh mục ngành hàng)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100),
    image_url VARCHAR(255)
);

-- 5. BẢNG PRODUCTS (Sản phẩm kinh doanh)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    original_price DECIMAL(12, 2) NOT NULL CHECK (original_price >= 0),
    sale_price DECIMAL(12, 2) NOT NULL CHECK (sale_price >= 0 AND sale_price <= original_price),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sold_quantity INT NOT NULL DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 5.00,
    rating_count INT DEFAULT 0,
    image_url VARCHAR(255) NOT NULL,
    images JSONB DEFAULT '[]',
    is_flash_sale BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG VOUCHERS (Mã giảm giá & Khuyến mãi Grape)
CREATE TABLE vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENT', 'FIXED_AMOUNT', 'FREE_SHIPPING')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    min_spend DECIMAL(12, 2) NOT NULL DEFAULT 0,
    max_discount DECIMAL(12, 2) DEFAULT NULL,
    usage_limit INT NOT NULL DEFAULT 100,
    used_count INT NOT NULL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ORDERS (Đơn hàng)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(30) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    shipping_address_id INT REFERENCES addresses(id),
    voucher_id INT REFERENCES vouchers(id),
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 30000.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'COD' CHECK (payment_method IN ('COD', 'MOMO', 'GRAPEPAY', 'BANKING')),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
    notes TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG ORDER_ITEMS (Mặt hàng chi tiết trong đơn hàng)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL
);

-- 9. BẢNG ORDER_TIMELINE_LOGS (Nhật ký trạng thái đơn hàng thời gian thực)
CREATE TABLE order_timeline_logs (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG INVOICES (Hóa đơn xuất bán lẻ điện tử)
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    order_id INT UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    shipping_address TEXT NOT NULL,
    tax_code VARCHAR(50) DEFAULT '0318999999',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    vat_amount DECIMAL(12, 2) DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_exported BOOLEAN DEFAULT FALSE
);

-- INDEXES TỐI ƯU HÓA TRUY VẤN
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(sale_price);
CREATE INDEX idx_products_sold ON products(sold_quantity DESC);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_otp_user_code ON otp_logs(user_id, otp_code, is_used);
