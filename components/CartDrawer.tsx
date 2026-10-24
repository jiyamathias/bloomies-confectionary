'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag, Lock, Loader2 } from 'lucide-react';
import { useCart, buildWhatsAppMessage, whatsappLink, payableTotal } from '@/lib/cart';
import { formatNaira } from '@/lib/pricing';
import { WAIcon } from '@/components/WhatsAppBtn';

export const PENDING_ORDER_KEY = 'bloomies_pending_order';
const CONTACT_KEY = 'bloomies_contact';

type Method = 'pickup' | 'delivery';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, changeQty, remove } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<Method>('pickup');
  const [address, setAddress] = useState('');
  const [payEnabled, setPayEnabled] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const total = payableTotal(items);
  const canPayOnline = payEnabled && total !== null;

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Is online payment switched on for this site?
  useEffect(() => {
    if (!open) return;
    fetch('/api/checkout').then(r => r.json()).then(d => setPayEnabled(!!d.enabled)).catch(() => setPayEnabled(false));
  }, [open]);

  // Remember contact details for next time (this browser only).
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CONTACT_KEY) || '{}');
      setName(c.name || ''); setPhone(c.phone || ''); setEmail(c.email || '');
      setMethod(c.method === 'delivery' ? 'delivery' : 'pickup'); setAddress(c.address || '');
    } catch { /* ignore */ }
  }, []);
  function saveContact() {
    try { localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone, email, method, address })); } catch { /* ignore */ }
  }

  function validate(forPayment: boolean) {
    if (!name.trim()) return 'Please enter your name.';
    if (phone.replace(/\D/g, '').length < 10) return 'Please enter your phone number.';
    if (forPayment && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter your email for the payment receipt.';
    if (method === 'delivery' && !address.trim()) return 'Please enter your delivery address.';
    return '';
  }

  function orderOnWhatsApp() {
    const problem = validate(false);
    if (problem) { setError(problem); return; }
    setError(''); saveContact();
    window.open(whatsappLink(buildWhatsAppMessage(items, { name, phone, method, address })), '_blank');
  }

  async function payNow() {
    const problem = validate(true);
    if (problem) { setError(problem); return; }
    setError(''); setPaying(true); saveContact();
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, phone, email, method, address },
          items: items.map(i => ({ productId: i.productId, qty: i.qty, options: i.options, details: i.details })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.link) throw new Error(data.error || 'Something went wrong. Please try again.');
      // Keep a copy so the confirmation page can show it and send it on WhatsApp.
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({
        txRef: data.txRef, amount: data.amount, items, contact: { name, phone, method, address },
      }));
      window.location.href = data.link;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setPaying(false);
    }
  }

  const field = `w-full px-4 py-2.5 rounded-xl border border-[rgba(165,140,244,0.35)]
    text-[0.88rem] text-[#433075] bg-white placeholder:text-[#8A86A6]
    focus:border-[#433075] focus:outline-none`;

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
        role="dialog" aria-modal="true" aria-label="Your order"
        aria-hidden={!open}
        className={`fixed top-0 right-0 bottom-0 z-[61] bg-[#FAFAFE] shadow-2xl
          w-full sm:w-[440px] flex flex-col
          transition-[transform,visibility] duration-300 ease-out
          ${open ? 'translate-x-0 visible' : 'translate-x-full invisible'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[rgba(165,140,244,0.18)]">
          <h2 className="font-luckiest tracking-[0.02em] text-[1.6rem] text-[#433075] pt-1">Your Order</h2>
          <button onClick={onClose} aria-label="Close cart" className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#5E5A7C] hover:text-[#433075] hover:bg-[#F3F0FA] transition-colors">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#5E5A7C] px-6">
            <ShoppingBag size={44} className="opacity-25" />
            <p className="text-sm text-center">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Items */}
              <ul className="space-y-2.5">
                {items.map(item => {
                  const lineTotal = typeof item.unitPrice === 'number' ? formatNaira(item.unitPrice * item.qty) : null;
                  return (
                    <li key={item.id} className="flex gap-3 bg-white border border-[rgba(165,140,244,0.15)] rounded-xl p-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                        <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.9rem] font-semibold text-[#433075] truncate">{item.name}</p>
                        {item.customisation && (
                          <p className="text-[0.75rem] text-[#5E5A7C] truncate">{item.customisation}</p>
                        )}
                        <p className="text-[0.8rem] mt-0.5">
                          {lineTotal
                            ? <span className="font-semibold text-[#433075]">{lineTotal}</span>
                            : <span className="text-[#5E5A7C]">{item.price} · price confirmed on WhatsApp</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => changeQty(item.id, -1)} aria-label={`Fewer ${item.name}`}
                            className="w-9 h-9 rounded-full bg-white border border-[#E1D7F0] flex items-center justify-center
                              text-[#433075] hover:bg-[#F3F0FA] transition-colors">
                            <Minus size={13} />
                          </button>
                          <span className="text-[0.88rem] font-semibold text-[#433075] w-5 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} aria-label={`More ${item.name}`}
                            className="w-9 h-9 rounded-full bg-white border border-[#E1D7F0] flex items-center justify-center
                              text-[#433075] hover:bg-[#F3F0FA] transition-colors">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}
                        className="w-9 h-9 -mr-1 -mt-1 rounded-full flex items-center justify-center text-[#A9A5BF] hover:text-[#433075] hover:bg-[#F3F0FA] transition-colors self-start">
                        <Trash2 size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Totals */}
              <div className="bg-white border border-[rgba(165,140,244,0.15)] rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-[0.85rem] text-[#5E5A7C]">
                  <span>Items</span><span>{count}</span>
                </div>
                <div className="flex justify-between text-[1rem] font-semibold text-[#433075]">
                  <span>Total</span>
                  <span>{total !== null ? formatNaira(total) : 'Confirmed on WhatsApp'}</span>
                </div>
                <p className="text-[0.75rem] text-[#5E5A7C] leading-snug pt-1">
                  {total !== null
                    ? 'Delivery fee is not included. We\'ll confirm it with you on WhatsApp.'
                    : 'Some items need a price from us first, so this order goes through WhatsApp.'}
                </p>
              </div>

              {/* Customer details */}
              <div className="space-y-2.5">
                <p className="text-[0.9rem] font-semibold text-[#433075]">Your details</p>
                <input className={field} value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" autoComplete="name" />
                <input className={field} type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Phone / WhatsApp number" autoComplete="tel" />
                {canPayOnline && (
                  <input className={field} type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email (for your receipt)" autoComplete="email" />
                )}

                <div className="grid grid-cols-2 gap-2 pt-1" role="radiogroup" aria-label="Pickup or delivery">
                  {(['pickup', 'delivery'] as Method[]).map(m => (
                    <button key={m} type="button" role="radio" aria-checked={method === m}
                      onClick={() => setMethod(m)}
                      className={`py-2.5 rounded-xl text-[0.85rem] font-semibold border transition-colors
                        ${method === m
                          ? 'bg-[#433075] text-white border-[#433075]'
                          : 'bg-white text-[#433075] border-[rgba(165,140,244,0.35)] hover:bg-[#F3F0FA]'}`}>
                      {m === 'pickup' ? 'Pickup' : 'Delivery'}
                    </button>
                  ))}
                </div>
                {method === 'delivery' ? (
                  <textarea className={`${field} resize-none`} rows={2} value={address}
                    onChange={e => setAddress(e.target.value)} placeholder="Delivery address" autoComplete="street-address" />
                ) : (
                  <p className="text-[0.75rem] text-[#5E5A7C]">Pick up from No 33 Amadimati Street, Mgbuoba. Mon – Sat, till 5 PM.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 bg-white border-t border-[rgba(165,140,244,0.18)] space-y-2.5">
              {error && <p role="alert" className="text-[0.8rem] text-[#B42318] text-center">{error}</p>}

              {canPayOnline ? (
                <>
                  <button onClick={payNow} disabled={paying}
                    className="w-full bg-[#433075] text-white rounded-full py-3.5 font-semibold text-[0.92rem]
                      flex items-center justify-center gap-2 hover:bg-[#5B3E8A] transition-colors
                      disabled:opacity-70 disabled:cursor-wait active:scale-[0.98]">
                    {paying ? <Loader2 size={17} className="animate-spin" /> : <Lock size={15} />}
                    {paying ? 'Opening secure payment…' : `Pay ${formatNaira(total!)} now`}
                  </button>
                  <button onClick={orderOnWhatsApp} disabled={paying}
                    className="w-full text-[#433075] rounded-full py-3 font-semibold text-[0.85rem]
                      flex items-center justify-center gap-2 border border-[rgba(67,48,117,0.25)]
                      hover:bg-[#F3F0FA] transition-colors">
                    Or order on WhatsApp
                  </button>
                  <p className="text-[0.72rem] text-[#5E5A7C] text-center">
                    Card, bank transfer or USSD, processed securely by Flutterwave.
                  </p>
                </>
              ) : (
                <button onClick={orderOnWhatsApp}
                  className="w-full bg-[#25D366] text-white rounded-full py-3.5 font-semibold
                    text-[0.92rem] flex items-center justify-center gap-2
                    hover:bg-[#1BBE5C] transition-colors active:scale-[0.98]">
                  <WAIcon /> Send order on WhatsApp
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
