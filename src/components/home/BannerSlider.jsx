import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const BannerSlider = ({ onBannerClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: '🍇 SIÊU ĐẠI TIỆC NHO XANH 2026',
      title: 'Khuyến Mãi Khủng Đến 50% Toàn Bộ Sản Phẩm',
      desc: 'Giảm sốc tai nghe ANC, đầm hoa voan & voucher Freeship toàn quốc',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
      actionText: 'Săn Ngay',
      category: 'all'
    },
    {
      id: 2,
      badge: '⚡ FLASH SALE BÙNG NỔ',
      title: 'Nho Shine Muscat Thượng Hạng & Mỹ Phẩm Nho Xanh',
      desc: 'Chiết xuất từ nho hữu cơ Pháp cho làn da căng bóng rạng ngời',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000',
      actionText: 'Khám Phá',
      category: 3
    },
    {
      id: 3,
      badge: '🔥 BỘ SƯU TẬP GRAPE TECH',
      title: 'Đồng Hồ Ultra 2 & Bàn Phím Cơ Nho Xanh Pro',
      desc: 'Công nghệ tiên phong viền Titanium, switch êm ái màu xanh ngọc bích',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000',
      actionText: 'Mua Liền Tay',
      category: 2
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="grape-hero-section">
      {/* Main Slider */}
      <div className="grape-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="grape-slide-item"
            style={{
              backgroundImage: `url(${slide.image})`,
              display: index === currentSlide ? 'flex' : 'none',
              animation: 'fadeInDown 0.4s ease'
            }}
          >
            <div className="grape-slide-content">
              <span className="grape-slide-badge">{slide.badge}</span>
              <h2 className="grape-slide-title">{slide.title}</h2>
              <p className="grape-slide-desc">{slide.desc}</p>
              <button
                onClick={() => onBannerClick(slide.category)}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-orange)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{slide.actionText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '12px',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.3)',
            color: '#FFFFFF',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '12px',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.3)',
            color: '#FFFFFF',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentSlide ? 'var(--accent-500)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* 2 Side Promotion Banners */}
      <div className="grape-hero-side-banners">
        <div
          className="side-banner-card"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600)' }}
          onClick={() => onBannerClick(5)}
        >
          <div className="side-banner-content">
            <span style={{ background: '#00BFA5', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>FREESHIP XTRA</span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', margin: '4px 0 2px' }}>Giày Thể Thao Sneaker</div>
            <div style={{ fontSize: '0.78rem', color: '#FFD166' }}>Giảm 45% + Tặng Voucher 50K</div>
          </div>
        </div>

        <div
          className="side-banner-card"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600)' }}
          onClick={() => onBannerClick(7)}
        >
          <div className="side-banner-content">
            <span style={{ background: 'var(--accent-500)', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>GRAPE FRESH</span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', margin: '4px 0 2px' }}>Nho Mẫu Đơn Quà Tặng</div>
            <div style={{ fontSize: '0.78rem', color: '#E0AAFF' }}>Hàng nhập khẩu tươi ngon mỗi ngày</div>
          </div>
        </div>
      </div>
    </div>
  );
};
