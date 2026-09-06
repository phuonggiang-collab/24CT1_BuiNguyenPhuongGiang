import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => {
          let bg = '#FFFFFF';
          let border = '#E2E8F0';
          let icon = <Info size={18} color="#3B82F6" />;
          if (toast.type === 'success') {
            border = '#10B981';
            icon = <CheckCircle2 size={18} color="#10B981" />;
          } else if (toast.type === 'error') {
            border = '#EF233C';
            icon = <AlertCircle size={18} color="#EF233C" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                background: bg,
                borderLeft: `4px solid ${border}`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '280px',
                maxWidth: '400px',
                pointerEvents: 'auto',
                animation: 'fadeInDown 0.25s ease',
                fontSize: '0.88rem',
                color: '#1E293B',
                fontWeight: 500
              }}
            >
              {icon}
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
