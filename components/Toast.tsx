'use client';
import { useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';

interface Toast {
  id: number;
  msg: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2600);
  }, []);

  return { toasts, show };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-[#5B2D8E] text-white px-6 py-3 rounded-full text-[0.84rem]
            shadow-[0_10px_36px_rgba(91,45,142,0.28)] flex items-center gap-2
            animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
          style={{ animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          <CheckCircle size={14} className="text-[#5CB85C]" />
          {t.msg}
        </div>
      ))}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
