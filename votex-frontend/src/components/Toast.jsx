// Toast notification system via Context
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
        {toasts.map(t => (
          <div key={t.id}
            className={`glass-card p-4 text-sm font-medium animate-[slideUp_0.3s_ease-out] toast-${t.type}`}
            style={{ minWidth: '260px' }}>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">
                {t.type === 'success' && '✅'}
                {t.type === 'error'   && '❌'}
                {t.type === 'info'    && 'ℹ️'}
              </span>
              <span className="text-slate-200">{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
