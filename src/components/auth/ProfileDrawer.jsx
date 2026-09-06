import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Plus, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileDrawer = () => {
  const { user, isProfileDrawerOpen, setIsProfileDrawerOpen, addAddress } = useAuth();

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  if (!isProfileDrawerOpen) return null;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!receiverName || !phone || !detailedAddress) return;

    await addAddress({
      receiver_name: receiverName,
      phone,
      province,
      district,
      ward,
      detailed_address: detailedAddress,
      is_default: isDefault
    });

    setShowAddAddress(false);
    setReceiverName('');
    setPhone('');
    setDetailedAddress('');
  };

  return (
    <div className="grape-modal-backdrop" onClick={() => setIsProfileDrawerOpen(false)}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '580px', width: '100%', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={() => setIsProfileDrawerOpen(false)}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--grape-900)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={22} color="var(--grape-600)" />
          <span>Hồ Sơ Của Tôi 🍇</span>
        </h2>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'var(--grape-50)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid var(--grape-200)'
        }}>
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="avatar"
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--grape-600)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {user?.full_name || 'Khách hàng Grape'}
              </span>
              {user?.is_verified && (
                <span style={{ background: '#D1FAE5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={12} /> Đã xác thực OTP
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {user?.email} • {user?.phone || 'Chưa cập nhật SĐT'}
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={18} color="var(--accent-500)" />
              <span>Địa Chỉ Giao Hàng</span>
            </span>

            <button
              onClick={() => setShowAddAddress(true)}
              style={{
                background: 'var(--grape-600)',
                color: '#FFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} /> Thêm Địa Chỉ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
            {(user?.addresses || []).map((addr) => (
              <div
                key={addr.id}
                style={{
                  border: addr.is_default ? '1.5px solid var(--grape-600)' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  background: addr.is_default ? 'var(--grape-50)' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {addr.receiver_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({addr.phone})</span>
                  </span>
                  {addr.is_default && (
                    <span style={{ background: 'var(--grape-600)', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '3px' }}>
                      Mặc Định
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {addr.detailed_address}, {addr.ward || ''}, {addr.district || ''}, {addr.province || ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Address Form Submodal */}
        {showAddAddress && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Thêm địa chỉ nhận hàng mới</h4>
            <form onSubmit={handleSaveAddress}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Họ tên người nhận"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                  style={{ padding: '7px 10px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.82rem' }}
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ padding: '7px 10px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.82rem' }}
                />
              </div>
              <input
                type="text"
                placeholder="Địa chỉ chi tiết..."
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                required
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.82rem', marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ background: 'var(--grape-600)', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
