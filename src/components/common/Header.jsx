import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Bell, HelpCircle, Smartphone, LogOut, PackageCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export const Header = ({ currentView, setCurrentView, onSearch, activeCategory, setActiveCategory }) => {
  const { user, isAuthenticated, openAuthModal, logout, setIsProfileDrawerOpen } = useAuth();
  const { totalItemsCount } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    return ['Tai nghe bluetooth', 'Đầm voan hoa', 'Serum nho', 'Đồng hồ thông minh', 'Sneaker'];
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);

  // Lắng nghe click ngoài dropdown tìm kiếm
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gợi ý từ khóa khi nhập
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      api.searchProducts(searchQuery).then(res => {
        if (res.success && res.suggestions) {
          setSuggestions(res.suggestions);
        }
      }).catch(() => {});
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    if (!searchHistory.includes(searchQuery.trim())) {
      setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 5)]);
    }

    setShowSearchDropdown(false);
    onSearch(searchQuery.trim());
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setShowSearchDropdown(false);
    onSearch(tag);
  };

  return (
    <header className="grape-header">
      <div className="grape-container">
        {/* Top Mini Navigation (Chuẩn Shopee) */}
        <div className="grape-top-nav">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="#seller" onClick={(e) => e.preventDefault()}>Kênh Người Bán Grape</a>
            <span style={{ opacity: 0.4 }}>|</span>
            <a href="#download" onClick={(e) => e.preventDefault()} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Smartphone size={13} /> Tải Ứng Dụng Grape
            </a>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>Kết nối: 🍇 Facebook | Instagram | TikTok</span>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <button onClick={() => {}} title="Thông báo">
              <Bell size={14} /> Thông Báo
            </button>
            <button onClick={() => {}} title="Trợ giúp">
              <HelpCircle size={14} /> Hỗ Trợ
            </button>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="avatar"
                    className="grape-avatar-circle"
                    style={{ width: 20, height: 20 }}
                  />
                  {user?.full_name || 'Tài khoản'}
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    padding: '8px 0',
                    minWidth: '180px',
                    zIndex: 1200,
                    color: '#1E293B'
                  }}>
                    <button
                      onClick={() => { setShowUserMenu(false); setIsProfileDrawerOpen(true); }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', textAlign: 'left' }}
                    >
                      <User size={15} color="var(--grape-600)" /> Tài khoản của tôi
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); setCurrentView('orders'); }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', textAlign: 'left' }}
                    >
                      <PackageCheck size={15} color="var(--grape-600)" /> Đơn mua của tôi
                    </button>
                    <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#EF233C', textAlign: 'left' }}
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => openAuthModal('register')} style={{ fontWeight: 600 }}>Đăng Ký</button>
                <span style={{ opacity: 0.4 }}>|</span>
                <button onClick={() => openAuthModal('login')} style={{ fontWeight: 600 }}>Đăng Nhập</button>
              </div>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="grape-main-header">
          {/* Logo */}
          <div
            className="grape-brand-logo"
            onClick={() => { setCurrentView('home'); setActiveCategory('all'); }}
          >
            <span className="brand-icon">🍇</span>
            <div>
              <div className="brand-name">Grape Store</div>
              <div className="brand-tagline">Nho Xanh Shine Muscat Edition</div>
            </div>
          </div>

          {/* Search Box */}
          <div className="grape-search-container" ref={searchRef}>
            <form className="grape-search-box" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="grape-search-input"
                placeholder="Tìm kiếm sản phẩm, thương hiệu hoặc từ khóa hot trên Grape Store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
              />
              <button type="submit" className="grape-search-btn">
                <Search size={19} />
              </button>
            </form>

            {/* Dropdown Lịch sử & Gợi ý */}
            {showSearchDropdown && (
              <div className="grape-search-dropdown">
                {suggestions.length > 0 ? (
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-title">Gợi ý tìm kiếm</div>
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="search-suggestion-item"
                        onClick={() => handleTagClick(s)}
                      >
                        <Search size={14} color="#94A3B8" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-title">
                      <span>Lịch sử tìm kiếm</span>
                      {searchHistory.length > 0 && (
                        <span
                          style={{ cursor: 'pointer', color: '#94A3B8', fontWeight: 400 }}
                          onClick={() => setSearchHistory([])}
                        >
                          Xóa
                        </span>
                      )}
                    </div>
                    <div className="search-history-tags">
                      {searchHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className="search-history-tag"
                          onClick={() => handleTagClick(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hot Keywords bar */}
            <div className="grape-hot-keywords">
              <span onClick={() => handleTagClick('Tai nghe Bluetooth')}>Tai nghe ANC 🎧</span>
              <span onClick={() => handleTagClick('Váy voan')}>Váy Nữ Mùa Hè 👗</span>
              <span onClick={() => handleTagClick('Serum Nho')}>Serum Nho Xanh 🍇</span>
              <span onClick={() => handleTagClick('Giày Sneaker')}>Sneaker Unisex 👟</span>
              <span onClick={() => handleTagClick('Nho Shine Muscat')}>Nho Mẫu Đơn 🍇</span>
              <span onClick={() => handleTagClick('Bàn phím cơ')}>Bàn phím cơ Switch Xanh ⌨️</span>
            </div>
          </div>

          {/* Actions: Cart & Orders */}
          <div className="grape-header-actions">
            <button
              className="grape-user-menu-btn"
              onClick={() => setCurrentView('orders')}
              style={{ background: currentView === 'orders' ? 'rgba(255,255,255,0.3)' : undefined }}
            >
              <PackageCheck size={18} />
              <span>Đơn Hàng</span>
            </button>

            <button
              className="grape-cart-btn"
              onClick={() => setCurrentView('cart')}
              title="Giỏ hàng"
            >
              <ShoppingCart size={22} />
              {totalItemsCount > 0 && (
                <span className="grape-cart-badge">{totalItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
