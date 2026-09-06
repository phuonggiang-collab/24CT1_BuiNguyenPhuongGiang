import React, { useState, useEffect } from 'react';
import { Package, Search, Truck, FileText, XCircle, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { OrderTimeline } from './OrderTimeline';
import { InvoiceModal } from './InvoiceModal';
import { useToast } from '../../context/ToastContext';

export const OrderManagement = ({ onBackToHome }) => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  const tabs = [
    { key: 'ALL', label: 'Tất Cả' },
    { key: 'PENDING', label: 'Chờ Xác Nhận' },
    { key: 'PROCESSING', label: 'Đang Xử Lý' },
    { key: 'SHIPPING', label: 'Đang Giao' },
    { key: 'DELIVERED', label: 'Đã Giao' },
    { key: 'CANCELLED', label: 'Đã Hủy' }
  ];

  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const res = await api.getUserOrders(status);
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    try {
      const res = await api.cancelOrder(orderId);
      if (res.success) {
        addToast('Đã hủy đơn hàng thành công', 'success');
        fetchOrders(activeTab);
      } else {
        addToast(res.message || 'Không thể hủy đơn', 'error');
      }
    } catch (e) {
      addToast('Lỗi khi hủy đơn hàng', 'error');
    }
  };

  const handleOpenTimeline = async (order) => {
    try {
      const res = await api.getOrderDetail(order.id);
      if (res.success && res.order) {
        setSelectedOrderForTimeline(res.order);
      } else {
        setSelectedOrderForTimeline(order);
      }
    } catch (e) {
      setSelectedOrderForTimeline(order);
    }
  };

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

  const filteredOrders = orders.filter(o =>
    o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items?.some(i => i.product_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'PROCESSING': return 'Đang đóng gói';
      case 'SHIPPING': return 'Đang vận chuyển';
      case 'DELIVERED': return 'Giao hàng thành công';
      case 'CANCELLED': return 'Đã hủy đơn';
      default: return status;
    }
  };

  return (
    <div className="grape-container" style={{ margin: '24px auto' }}>
      {/* Header back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--grape-600)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} />
            <span>Trang chủ</span>
          </button>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quản lý đơn hàng</span>
        </div>

        {/* Search Order input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Tìm theo Mã đơn hoặc Tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              border: '1px solid #CBD5E1',
              borderRadius: '20px',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFFFFF'
            }}
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="order-status-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`order-tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ background: '#FFFFFF', padding: '60px', textAlign: 'center', borderRadius: '8px', color: 'var(--grape-600)' }}>
          Đang tải danh sách đơn hàng... 🍇
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          padding: '70px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <ShoppingBag size={52} color="var(--grape-300)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Chưa có đơn hàng nào
          </h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>
            Bạn chưa có đơn hàng nào trong trạng thái này.
          </p>
          <button
            onClick={onBackToHome}
            style={{
              background: 'var(--grape-600)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Khám Phá Sản Phẩm Ngay 🍇
          </button>
        </div>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card-wrapper">
              {/* Order Header */}
              <div className="order-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--grape-900)' }}>
                    Mã đơn: #{order.order_code}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                    Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`order-status-tag status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
                {(order.items || []).map((item, idx) => (
                  <div key={item.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={item.product_image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'}
                        alt={item.product_name}
                        style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover', border: '1px solid #E2E8F0' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {item.product_name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Số lượng: x{item.quantity}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, color: 'var(--grape-700)', fontSize: '0.92rem' }}>
                      {formatPrice(item.total_price || item.unit_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Phương thức: <strong style={{ color: 'var(--text-primary)' }}>{order.payment_method}</strong> ({order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Tổng tiền:</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--grape-600)' }}>
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        style={{
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '4px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Hủy Đơn
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenTimeline(order)}
                      style={{
                        background: 'var(--grape-50)',
                        border: '1px solid var(--grape-600)',
                        color: 'var(--grape-700)',
                        padding: '7px 14px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Truck size={15} /> Theo Dõi Đơn
                    </button>

                    <button
                      onClick={() => setSelectedOrderForInvoice(order.id)}
                      style={{
                        background: 'linear-gradient(135deg, var(--grape-600), var(--grape-700))',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '7px 14px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={15} /> Xem Hóa Đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      {selectedOrderForTimeline && (
        <OrderTimeline
          order={selectedOrderForTimeline}
          onClose={() => setSelectedOrderForTimeline(null)}
        />
      )}

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          orderId={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};
