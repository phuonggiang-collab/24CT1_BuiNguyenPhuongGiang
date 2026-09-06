import React from 'react';
import { X, Package, CheckCircle2, Truck, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

export const OrderTimeline = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { key: 'PENDING', label: 'Đặt Hàng', icon: ShoppingBag, desc: 'Đơn hàng đã được tạo thành công' },
    { key: 'PROCESSING', label: 'Chuẩn Bị Hàng', icon: Package, desc: 'Shop đang kiểm tra và đóng gói' },
    { key: 'SHIPPING', label: 'Đang Giao', icon: Truck, desc: 'Bưu tá đang vận chuyển giao đến bạn' },
    { key: 'DELIVERED', label: 'Đã Giao', icon: CheckCircle2, desc: 'Kiện hàng đã được ký nhận thành công' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPING': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="grape-modal-backdrop" onClick={onClose}>
      <div
        className="grape-modal-card"
        style={{ maxWidth: '640px', width: '100%', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Truck size={22} color="var(--grape-600)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--grape-900)' }}>
            Tiến Trình Đơn Hàng #{order.order_code}
          </h2>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Đơn vị vận chuyển: <strong style={{ color: 'var(--grape-700)' }}>🍇 Grape Express Nhanh</strong>
        </div>

        {/* Visual Timeline Steps Bar */}
        {isCancelled ? (
          <div style={{ background: '#FEE2E2', padding: '16px', borderRadius: '8px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <AlertCircle size={22} />
            <div>
              <div style={{ fontWeight: 700 }}>Đơn hàng này đã bị hủy</div>
              <div style={{ fontSize: '0.8rem' }}>Mọi giao dịch và khoản tiền đã được hoàn trả.</div>
            </div>
          </div>
        ) : (
          <div className="timeline-track-container">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={step.key}
                  className={`timeline-step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="timeline-step-circle">
                    <IconComp size={20} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCompleted ? 'var(--grape-900)' : 'var(--text-muted)' }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline Event Logs */}
        <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Lịch Sử Trạng Thái Chi Tiết
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(order.timeline || [
              {
                id: 1,
                title: 'Đơn hàng đã được tạo',
                description: 'Đơn hàng khởi tạo thành công trên hệ thống Grape Store',
                timestamp: order.order_date || new Date()
              }
            ]).map((log, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--grape-600)' }} />
                  {index < (order.timeline?.length || 1) - 1 && (
                    <div style={{ width: 2, flex: 1, background: '#CBD5E1', margin: '4px 0' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0' }}>{log.description}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
