const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

// Helper sinh mã OTP ngẫu nhiên 6 chữ số
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser && existingUser.is_verified) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    let user = existingUser;
    if (!user) {
      const newUser = {
        id: db.users.length + 1,
        full_name,
        email: email.toLowerCase(),
        phone: phone || '',
        password_hash: bcrypt.hashSync(password, 8),
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(full_name)}`,
        is_verified: false,
        role: 'CUSTOMER',
        created_at: new Date()
      };
      db.users.push(newUser);
      user = newUser;
    } else {
      user.full_name = full_name;
      user.password_hash = bcrypt.hashSync(password, 8);
      user.phone = phone || user.phone;
    }

    // Sinh mã OTP 6 số (hạn 5 phút)
    const otp_code = generateOtpCode();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    // Hủy các OTP cũ của user này
    db.otp_logs.forEach(log => {
      if (log.user_id === user.id) log.is_used = true;
    });

    db.otp_logs.push({
      id: db.otp_logs.length + 1,
      user_id: user.id,
      otp_code,
      type: 'REGISTER_VERIFY',
      expires_at,
      is_used: false,
      created_at: new Date()
    });

    console.log(`[GRAPE_AUTH] 🍇 Mã OTP gửi tới ${user.email}: ${otp_code}`);

    return res.status(201).json({
      success: true,
      message: 'Mã xác thực OTP đã được gửi đến email/SĐT của bạn.',
      userId: user.id,
      email: user.email,
      phone: user.phone,
      previewOtp: otp_code // Hỗ trợ trải nghiệm demo mượt mà ngay trên UI
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    const { userId, otp_code } = req.body;

    if (!userId || !otp_code) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin người dùng hoặc mã OTP' });
    }

    const user = db.users.find(u => u.id === Number(userId));
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const otpLog = db.otp_logs
      .filter(l => l.user_id === user.id && !l.is_used)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!otpLog) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy yêu cầu OTP hoặc mã đã được sử dụng' });
    }

    if (new Date() > new Date(otpLog.expires_at)) {
      return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã.' });
    }

    if (otpLog.otp_code !== otp_code.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Mã xác thực OTP không chính xác!' });
    }

    // Đánh dấu mã đã sử dụng & kích hoạt tài khoản
    otpLog.is_used = true;
    user.is_verified = true;

    // Tạo địa chỉ mặc định nếu chưa có
    const hasAddress = db.addresses.some(a => a.user_id === user.id);
    if (!hasAddress) {
      db.addresses.push({
        id: db.addresses.length + 1,
        user_id: user.id,
        receiver_name: user.full_name,
        phone: user.phone || '0987654321',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detailed_address: 'Số 123 Đường Lê Lợi',
        is_default: true,
        created_at: new Date()
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userAddresses = db.addresses.filter(a => a.user_id === user.id);

    return res.status(200).json({
      success: true,
      message: 'Xác thực OTP thành công! Chào mừng bạn đến với Grape Store.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
        addresses: userAddresses
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOtp = (req, res) => {
  try {
    const { userId, email } = req.body;
    let user = null;
    if (userId) user = db.users.find(u => u.id === Number(userId));
    else if (email) user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const otp_code = generateOtpCode();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    db.otp_logs.forEach(log => {
      if (log.user_id === user.id) log.is_used = true;
    });

    db.otp_logs.push({
      id: db.otp_logs.length + 1,
      user_id: user.id,
      otp_code,
      type: 'REGISTER_VERIFY',
      expires_at,
      is_used: false,
      created_at: new Date()
    });

    console.log(`[GRAPE_AUTH] 🍇 Mã OTP gửi lại tới ${user.email}: ${otp_code}`);

    return res.status(200).json({
      success: true,
      message: 'Đã gửi lại mã OTP mới qua Email/SĐT!',
      userId: user.id,
      previewOtp: otp_code
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email/Số điện thoại và Mật khẩu' });
    }

    const user = db.users.find(
      u => (u.email && u.email.toLowerCase() === emailOrPhone.toLowerCase()) || u.phone === emailOrPhone
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    if (!user.is_verified) {
      // Yêu cầu xác thực OTP nếu tài khoản chưa kích hoạt
      const otp_code = generateOtpCode();
      db.otp_logs.push({
        id: db.otp_logs.length + 1,
        user_id: user.id,
        otp_code,
        type: 'REGISTER_VERIFY',
        expires_at: new Date(Date.now() + 5 * 60 * 1000),
        is_used: false,
        created_at: new Date()
      });

      return res.status(403).json({
        success: false,
        requiresOtp: true,
        userId: user.id,
        email: user.email,
        message: 'Tài khoản chưa được xác thực OTP. Vui lòng nhập mã OTP để tiếp tục.',
        previewOtp: otp_code
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userAddresses = db.addresses.filter(a => a.user_id === user.id);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
        addresses: userAddresses
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = (req, res) => {
  try {
    const user = req.user;
    const userAddresses = db.addresses.filter(a => a.user_id === user.id);
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
        addresses: userAddresses
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const user = req.user;
    const { full_name, phone, avatar_url } = req.body;

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (avatar_url) user.avatar_url = avatar_url;

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAddress = (req, res) => {
  try {
    const userId = req.user.id;
    const { receiver_name, phone, province, district, ward, detailed_address, is_default } = req.body;

    if (!receiver_name || !phone || !detailed_address) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng' });
    }

    if (is_default) {
      db.addresses.forEach(a => {
        if (a.user_id === userId) a.is_default = false;
      });
    }

    const newAddress = {
      id: db.addresses.length + 1,
      user_id: userId,
      receiver_name,
      phone,
      province: province || 'TP. Hồ Chí Minh',
      district: district || 'Quận 1',
      ward: ward || 'Phường Bến Nghé',
      detailed_address,
      is_default: !!is_default || db.addresses.filter(a => a.user_id === userId).length === 0,
      created_at: new Date()
    };

    db.addresses.push(newAddress);

    return res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ giao hàng thành công!',
      address: newAddress,
      addresses: db.addresses.filter(a => a.user_id === userId)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
