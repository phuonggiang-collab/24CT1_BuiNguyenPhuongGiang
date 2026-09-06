import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const FlashSale = ({ flashProducts, onSelectProduct }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  if (!flashProducts || flashProducts.length === 0) return null;

  return (
    <div className="grape-flash-sale-box">
      <div className="flash-sale-header">
        <div className="flash-sale-brand">
          <div className="flash-sale-title">
            <Zap size={24} fill="var(--accent-500)" color="var(--accent-500)" />
            <span>FLASH SALE</span>
          </div>

          <div className="flash-countdown">
            <span className="countdown-digit">{formatDigit(timeLeft.hours)}</span>
            <span className="countdown-colon">:</span>
            <span className="countdown-digit">{formatDigit(timeLeft.minutes)}</span>
            <span className="countdown-colon">:</span>
            <span className="countdown-digit">{formatDigit(timeLeft.seconds)}</span>
          </div>
        </div>

        <button
          onClick={() => {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-600)',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span>Xem Tất Cả</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flash-sale-grid">
        {flashProducts.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
            isFlashSaleMode={true}
          />
        ))}
      </div>
    </div>
  );
};
