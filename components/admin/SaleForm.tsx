'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { naira } from '@/lib/admin/analytics';
import {
  CHANNEL_LABEL, PAYMENT_LABEL, STATUS_LABEL,
  type Channel, type Order, type OrderItem, type OrderStatus, type PaymentMethod, type ProductCategory,
} from '@/lib/admin/types';
import Drawer, { Field, field } from '@/components/admin/Drawer';
import { btn } from '@/components/admin/AdminHeader';

const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const priceOf = (id: string) => {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return 0;
  return p.unitPrice ?? p.basePrice ?? (Number(p.price.replace(/,/g, '').match(/\d+/)?.[0]) || 0);
};

type Line = { productId: string; name: string; category: ProductCategory; qty: number; unitPrice: number };
const blankLine = (): Line => ({ productId: '', name: '', category: 'other', qty: 1, unitPrice: 0 });

export default function SaleForm({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (o: Omit<Order, 'id' | 'orderNumber'>) => void;
}) {
  const [createdAt, setCreatedAt] = useState(() => toLocalInput(new Date()));
  const [dueAt, setDueAt] = useState(() => toLocalInput(new Date()));
  const [customerName, setName] = useState('');
  const [customerPhone, setPhone] = useState('');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [lines, setLines] = useState<Line[]>([blankLine()]);
  const [fulfilment, setFulfilment] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const total = Math.max(subtotal + deliveryFee - discount, 0);
  const paid = amountPaid === '' ? total : amountPaid;

  function setLine(i: number, patch: Partial<Line>) {
    setLines(ls => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }
  function chooseProduct(i: number, id: string) {
    const p = PRODUCTS.find(x => x.id === id);
    setLine(i, p
      ? { productId: p.id, name: p.name, category: p.category as ProductCategory, unitPrice: priceOf(p.id) }
      : { productId: '', name: '', category: 'other', unitPrice: 0 });
  }

  function reset() {
    setCreatedAt(toLocalInput(new Date())); setDueAt(toLocalInput(new Date()));
    setName(''); setPhone(''); setLines([blankLine()]); setFulfilment('pickup'); setAddress('');
    setDeliveryFee(0); setDiscount(0); setAmountPaid(''); setStatus('confirmed'); setNote(''); setError('');
  }

  function save() {
    const items: OrderItem[] = lines.filter(l => l.name.trim() && l.qty > 0)
      .map(l => ({ productId: l.productId || undefined, name: l.name.trim(), category: l.category, qty: l.qty, unitPrice: l.unitPrice }));
    if (!items.length) return setError('Add at least one item.');
    if (!customerName.trim()) return setError('Add the customer name (or "Walk-in customer").');
    onSave({
      createdAt: new Date(createdAt).toISOString(), dueAt: new Date(dueAt).toISOString(),
      customerName: customerName.trim(), customerPhone: customerPhone.trim(), channel,
      fulfilment, deliveryAddress: fulfilment === 'delivery' ? address : undefined,
      items, subtotal, deliveryFee, discount, total, amountPaid: Math.min(paid, total),
      paymentMethod, status, note: note.trim() || undefined,
    });
    reset(); onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add a sale" wide
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-[0.85rem] text-[#5E5A7C]">
            Total <strong className="text-[#2B2147] text-[1.05rem] ml-1">{naira(total)}</strong>
            {paid < total && <span className="ml-2 text-[#B42318]">({naira(total - paid)} still owed)</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className={btn.secondary}>Cancel</button>
            <button onClick={save} className={btn.primary}>Save sale</button>
          </div>
        </div>
      }>
      <div className="space-y-5">
        {error && <p role="alert" className="text-[0.85rem] text-[#B42318] bg-[#FDECEC] rounded-xl px-3 py-2">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Customer name"><input className={field} value={customerName} onChange={e => setName(e.target.value)} placeholder="e.g. Chioma Okafor"/></Field>
          <Field label="Phone"><input className={field} value={customerPhone} onChange={e => setPhone(e.target.value)} placeholder="080…" inputMode="tel"/></Field>
          <Field label="Order came in through">
            <select className={field} value={channel} onChange={e => {
              const c = e.target.value as Channel; setChannel(c);
              if (c === 'walk-in') setPaymentMethod('pos');
              if (c === 'glovo' || c === 'chowdeck') setPaymentMethod('platform');
            }}>
              {Object.entries(CHANNEL_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Date and time ordered"><input type="datetime-local" className={field} value={createdAt} onChange={e => setCreatedAt(e.target.value)}/></Field>
        </div>

        <div>
          <p className="text-[0.8rem] font-medium text-[#2B2147] mb-2">Items</p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="bg-white border border-[#E6E0F3] rounded-xl p-3 grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 sm:col-span-5">
                  <select className={field} value={l.productId} onChange={e => chooseProduct(i, e.target.value)} aria-label="Product">
                    <option value="">Custom item…</option>
                    {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {!l.productId && (
                    <input className={`${field} mt-2`} value={l.name} onChange={e => setLine(i, { name: e.target.value })} placeholder="Item name" aria-label="Item name"/>
                  )}
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <span className="block text-[0.72rem] text-[#5E5A7C] mb-1">Qty</span>
                  <input type="number" min={1} className={field} value={l.qty} onChange={e => setLine(i, { qty: Math.max(1, Number(e.target.value) || 1) })}/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <span className="block text-[0.72rem] text-[#5E5A7C] mb-1">Price each (₦)</span>
                  <input type="number" min={0} step={100} className={field} value={l.unitPrice} onChange={e => setLine(i, { unitPrice: Math.max(0, Number(e.target.value) || 0) })}/>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 pb-2.5">
                  <span className="text-[0.82rem] font-semibold text-[#2B2147] tabular-nums">{naira(l.qty * l.unitPrice, true)}</span>
                  {lines.length > 1 && (
                    <button type="button" onClick={() => setLines(ls => ls.filter((_, j) => j !== i))} aria-label="Remove item"
                      className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center text-[#8A86A6] hover:text-[#B42318] hover:bg-[#FDECEC]"><Trash2 size={15}/></button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setLines(ls => [...ls, blankLine()])}
            className="mt-1 inline-flex items-center gap-1.5 py-2.5 text-[0.85rem] font-semibold text-[#433075] hover:underline">
            <Plus size={14}/> Add another item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Pickup or delivery">
            <select className={field} value={fulfilment} onChange={e => setFulfilment(e.target.value as 'pickup' | 'delivery')}>
              <option value="pickup">Pickup</option><option value="delivery">Delivery</option>
            </select>
          </Field>
          <Field label="Due (pickup / delivery time)"><input type="datetime-local" className={field} value={dueAt} onChange={e => setDueAt(e.target.value)}/></Field>
          {fulfilment === 'delivery' && (<>
            <Field label="Delivery address"><input className={field} value={address} onChange={e => setAddress(e.target.value)} placeholder="Area or full address"/></Field>
            <Field label="Delivery fee (₦)"><input type="number" min={0} step={500} className={field} value={deliveryFee} onChange={e => setDeliveryFee(Math.max(0, Number(e.target.value) || 0))}/></Field>
          </>)}
          <Field label="Discount (₦)"><input type="number" min={0} step={100} className={field} value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value) || 0))}/></Field>
          <Field label="Status">
            <select className={field} value={status} onChange={e => setStatus(e.target.value as OrderStatus)}>
              {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Payment method">
            <select className={field} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
              {Object.entries(PAYMENT_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Amount paid so far (₦)" hint="Leave empty if fully paid. Enter the deposit for part-payments.">
            <input type="number" min={0} step={100} className={field} value={amountPaid} placeholder={String(total)}
              onChange={e => setAmountPaid(e.target.value === '' ? '' : Math.max(0, Number(e.target.value) || 0))}/>
          </Field>
        </div>

        <Field label="Note (optional)">
          <textarea className={`${field} resize-none`} rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Message on cake, colours, anything to remember…"/>
        </Field>
      </div>
    </Drawer>
  );
}
