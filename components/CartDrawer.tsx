'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, buildWhatsAppMessage } from '@/lib/cart';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, changeQty, remove } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function checkout() {
    const msg = buildWhatsAppMessage(items, name || 'Customer', phone || '—');
    window.open(`https://wa.me/2348181154270?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/45 backdrop-blur-sm z-[60] transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[61] bg-white shadow-2xl
          w-full sm:w-[420px] flex flex-col
          transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(165,140,244,0.15)]">
          <h2 className="font-cormorant text-2xl font-semibold text-[#433075]">Your Order</h2>
          <button onClick={onClose} className="p-1.5 text-[#6E6A8C] hover:text-[#A58CF4] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6E6A8C]">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm">Your cart is empty.<br className="hidden sm:block" /> Add something sweet!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-[#FAFAFA] rounded-xl p-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.88rem] font-medium text-[#433075] truncate">{item.name}</p>
                    <p className="text-[0.78rem] text-[#A58CF4] mt-0.5">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white border border-[#E1D7F0] flex items-center justify-center
                          text-[#433075] hover:bg-[#E1D7F0] transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[0.88rem] font-semibold text-[#433075] w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-white border border-[#E1D7F0] flex items-center justify-center
                          text-[#433075] hover:bg-[#E1D7F0] transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-[#CCC] hover:text-[#A58CF4] transition-colors self-start mt-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(165,140,244,0.15)] space-y-4">
            <div className="flex justify-between text-[0.85rem] text-[#6E6A8C]">
              <span>Items</span><span>{count}</span>
            </div>
            <div className="flex justify-between text-[1rem] font-semibold text-[#433075]">
              <span>Total</span><span>Confirmed on WhatsApp</span>
            </div>

            {/* Customer details */}
            <div className="space-y-2.5">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name…"
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(165,140,244,0.25)]
                  text-[0.85rem] text-[#433075] bg-[#FAFAFA] focus:border-[#A58CF4] focus:outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="WhatsApp / Phone…"
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(165,140,244,0.25)]
                  text-[0.85rem] text-[#433075] bg-[#FAFAFA] focus:border-[#A58CF4] focus:outline-none"
              />
            </div>

            <button
              onClick={checkout}
              className="w-full bg-[#25D366] text-white rounded-full py-3.5 font-semibold
                text-[0.9rem] flex items-center justify-center gap-2
                hover:bg-[#1BBE5C] transition-all duration-300 active:scale-[0.98]"
            >
              <WhatsAppIcon />
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
