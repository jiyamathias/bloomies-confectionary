'use client';
import { useMemo, useState } from 'react';
import { Plus, Upload, Download, Search } from 'lucide-react';
import { useAdminData } from '@/lib/admin/store';
import { rangeFor, ordersIn, naira, toCsv, type RangeKey } from '@/lib/admin/analytics';
import {
  balanceOf, CHANNEL_LABEL, PAYMENT_LABEL, STATUS_LABEL,
  type Channel, type Order, type OrderStatus, type PaymentMethod,
} from '@/lib/admin/types';
import AdminHeader, { FilterRow, RangePicker, Select, btn } from '@/components/admin/AdminHeader';
import SaleForm from '@/components/admin/SaleForm';
import ImportSheet, { downloadFile } from '@/components/admin/ImportSheet';
import Drawer, { Field, field } from '@/components/admin/Drawer';

type PayFilter = 'all' | 'paid' | 'part' | 'unpaid';
const PAGE = 50;

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-[#FFF6DB] text-[#6B4E00]',
  confirmed: 'bg-[#EEE9FB] text-[#433075]',
  'in-progress': 'bg-[#E2BBFA] text-[#2B2147]',
  ready: 'bg-[#DDF3E3] text-[#1F6B2E]',
  completed: 'bg-[#F1EEF8] text-[#5E5A7C]',
  cancelled: 'bg-[#FDECEC] text-[#B42318]',
};

const fmtDate = (iso: string) => new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default function SalesLogPage() {
  const { orders, addOrder, addOrders, updateOrder, deleteOrder } = useAdminData();
  const [rangeKey, setRangeKey] = useState<RangeKey>('30d');
  const [channel, setChannel] = useState<Channel | 'all'>('all');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [pay, setPay] = useState<PayFilter>('all');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [flash, setFlash] = useState('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ordersIn(orders, rangeFor(rangeKey), channel).filter(o => {
      if (status !== 'all' && o.status !== status) return false;
      const bal = balanceOf(o);
      if (pay === 'paid' && bal > 0) return false;
      if (pay === 'part' && !(bal > 0 && o.amountPaid > 0)) return false;
      if (pay === 'unpaid' && !(bal > 0 && o.amountPaid === 0)) return false;
      if (!needle) return true;
      return [o.orderNumber, o.customerName, o.customerPhone, ...o.items.map(i => i.name)].join(' ').toLowerCase().includes(needle);
    });
  }, [orders, rangeKey, channel, status, pay, q]);

  const totals = useMemo(() => {
    const live = rows.filter(o => o.status !== 'cancelled');
    return {
      sales: live.reduce((s, o) => s + o.total, 0),
      collected: live.reduce((s, o) => s + o.amountPaid, 0),
      owed: live.reduce((s, o) => s + balanceOf(o), 0),
    };
  }, [rows]);

  const open = orders.find(o => o.id === openId) ?? null;

  function notify(msg: string) { setFlash(msg); setTimeout(() => setFlash(''), 3000); }

  function exportCsv() {
    const csv = toCsv(rows.map(o => ({
      'Order #': o.orderNumber,
      Date: new Date(o.createdAt).toLocaleDateString('en-GB'),
      Time: new Date(o.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      Customer: o.customerName, Phone: o.customerPhone,
      Items: o.items.map(i => `${i.qty} x ${i.name}`).join('; '),
      Channel: CHANNEL_LABEL[o.channel], Fulfilment: o.fulfilment,
      Subtotal: o.subtotal, 'Delivery fee': o.deliveryFee, Discount: o.discount, Total: o.total,
      'Amount paid': o.amountPaid, Balance: balanceOf(o),
      Payment: PAYMENT_LABEL[o.paymentMethod], Status: STATUS_LABEL[o.status],
      Due: new Date(o.dueAt).toLocaleString('en-GB'), Note: o.note ?? '',
    })));
    downloadFile(`bloomies-sales-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <AdminHeader title="Sales log" subtitle="Every order in one place: website, WhatsApp, walk-in and delivery apps."
        actions={<>
          <button className={btn.primary} onClick={() => setAdding(true)}><Plus size={16}/> Add sale</button>
          <button className={btn.secondary} onClick={() => setImporting(true)}><Upload size={15}/> Import sheet</button>
          <button className={btn.secondary} onClick={exportCsv}><Download size={15}/> Export CSV</button>
        </>}/>

      {flash && <p role="status" className="mb-4 bg-[#DDF3E3] text-[#1F6B2E] text-[0.85rem] rounded-xl px-4 py-2.5">{flash}</p>}

      <FilterRow>
        <RangePicker value={rangeKey} onChange={k => { setRangeKey(k); setLimit(PAGE); }}/>
        <Select label="Channel" value={channel} onChange={v => setChannel(v as Channel | 'all')}
          options={[['all', 'All'], ...Object.entries(CHANNEL_LABEL)]}/>
        <Select label="Status" value={status} onChange={v => setStatus(v as OrderStatus | 'all')}
          options={[['all', 'All'], ...Object.entries(STATUS_LABEL)]}/>
        <Select label="Payment" value={pay} onChange={v => setPay(v as PayFilter)}
          options={[['all', 'All'], ['paid', 'Fully paid'], ['part', 'Part paid'], ['unpaid', 'Not paid']]}/>
        <label className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A86A6]"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, order # or item"
            className="w-full bg-white border border-[#E6E0F3] rounded-xl pl-9 pr-3 py-2 text-[0.85rem] text-[#2B2147] focus:outline-none focus:border-[#433075]"/>
        </label>
      </FilterRow>

      {/* Summary of what's filtered */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          ['Orders', rows.length.toLocaleString()],
          ['Sales', naira(totals.sales)],
          ['Collected', naira(totals.collected)],
          ['Still owed', naira(totals.owed)],
        ].map(([l, v]) => (
          <div key={l} className="bg-white border border-[#E6E0F3] rounded-xl px-4 py-3">
            <p className="text-[0.75rem] text-[#5E5A7C]">{l}</p>
            <p className={`text-[1.15rem] font-semibold ${l === 'Still owed' && totals.owed > 0 ? 'text-[#B42318]' : 'text-[#2B2147]'}`}>{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E6E0F3] rounded-2xl overflow-hidden">
        {/* Phones: one card per order */}
        <ul className="md:hidden divide-y divide-[#F1EEF8]">
          {rows.slice(0, limit).map(o => {
            const bal = balanceOf(o);
            return (
              <li key={o.id}>
                <button onClick={() => setOpenId(o.id)} className="w-full text-left px-4 py-3.5 flex justify-between gap-3 active:bg-[#FAF9FD]">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[0.92rem] font-semibold text-[#2B2147]">
                      <span className="truncate">{o.customerName}</span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[0.7rem] font-semibold ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    </p>
                    <p className="text-[0.82rem] text-[#2B2147] truncate mt-0.5">{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</p>
                    <p className="text-[0.75rem] text-[#5E5A7C] mt-0.5">{fmtDate(o.createdAt)} · {o.orderNumber} · {CHANNEL_LABEL[o.channel]}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[0.92rem] font-semibold text-[#2B2147] tabular-nums">{naira(o.total)}</p>
                    <p className={`text-[0.75rem] mt-0.5 ${bal > 0 ? 'text-[#B42318] font-semibold' : 'text-[#8A86A6]'}`}>{bal > 0 ? `${naira(bal)} owed` : 'Paid'}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Tablets and up: full table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[0.83rem]">
            <thead className="bg-[#FAF9FD] text-[#5E5A7C] text-left">
              <tr>
                {['Date', 'Order', 'Customer', 'Items', 'From', 'Payment', 'Total', 'Balance', 'Status'].map((h, i) => (
                  <th key={h} className={`font-semibold px-3 py-2.5 whitespace-nowrap ${i >= 6 && i <= 7 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, limit).map(o => {
                const bal = balanceOf(o);
                return (
                  <tr key={o.id} onClick={() => setOpenId(o.id)}
                    className="border-t border-[#F1EEF8] hover:bg-[#FAF9FD] cursor-pointer">
                    <td className="px-3 py-2.5 whitespace-nowrap text-[#5E5A7C]">{fmtDate(o.createdAt)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap font-medium text-[#433075]">{o.orderNumber}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-[#2B2147]">{o.customerName}</td>
                    <td className="px-3 py-2.5 text-[#2B2147] max-w-[240px] truncate">{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{CHANNEL_LABEL[o.channel]}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{PAYMENT_LABEL[o.paymentMethod]}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-[#2B2147]">{naira(o.total)}</td>
                    <td className={`px-3 py-2.5 text-right tabular-nums ${bal > 0 ? 'text-[#B42318] font-semibold' : 'text-[#8A86A6]'}`}>{bal > 0 ? naira(bal) : 'Paid'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[0.72rem] font-semibold ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="text-center text-[0.88rem] text-[#5E5A7C] py-10">No sales match these filters.</p>}
        {rows.length > limit && (
          <div className="text-center py-4 border-t border-[#F1EEF8]">
            <button onClick={() => setLimit(l => l + PAGE)} className={btn.secondary}>
              Show more ({(rows.length - limit).toLocaleString()} left)
            </button>
          </div>
        )}
      </div>

      <SaleForm open={adding} onClose={() => setAdding(false)}
        onSave={o => { const created = addOrder(o); notify(`Sale ${created.orderNumber} saved.`); }}/>
      <ImportSheet open={importing} onClose={() => setImporting(false)}
        onImport={list => { addOrders(list); setRangeKey('12m'); }}/>
      <OrderDetails order={open} onClose={() => setOpenId(null)}
        onUpdate={(patch) => open && updateOrder(open.id, patch)}
        onDelete={() => { if (open) { deleteOrder(open.id); setOpenId(null); notify(`${open.orderNumber} deleted.`); } }}/>
    </div>
  );
}

function OrderDetails({ order, onClose, onUpdate, onDelete }: {
  order: Order | null; onClose: () => void; onUpdate: (p: Partial<Order>) => void; onDelete: () => void;
}) {
  const [payment, setPayment] = useState<number | ''>('');
  const [method, setMethod] = useState<PaymentMethod>('transfer');
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!order) return null;
  const bal = balanceOf(order);

  return (
    <Drawer open onClose={() => { setConfirmDelete(false); onClose(); }} title={`Order ${order.orderNumber}`}>
      <div className="space-y-5 text-[0.85rem] text-[#2B2147]">
        <div className="bg-white border border-[#E6E0F3] rounded-xl p-4 space-y-1.5">
          <p className="font-semibold text-[1rem]">{order.customerName}</p>
          {order.customerPhone && <p className="text-[#5E5A7C]">{order.customerPhone}</p>}
          <p className="text-[#5E5A7C]">Ordered {fmtDate(order.createdAt)} via {CHANNEL_LABEL[order.channel]}</p>
          <p className="text-[#5E5A7C]">
            {order.fulfilment === 'delivery' ? `Delivery to ${order.deliveryAddress || '—'}` : 'Pickup'} · due {fmtDate(order.dueAt)}
          </p>
          {order.note && <p className="pt-1">Note: {order.note}</p>}
        </div>

        <div className="bg-white border border-[#E6E0F3] rounded-xl p-4">
          <ul className="space-y-1.5">
            {order.items.map((i, k) => (
              <li key={k} className="flex justify-between gap-3"><span>{i.qty} × {i.name}</span><span className="tabular-nums">{naira(i.qty * i.unitPrice)}</span></li>
            ))}
          </ul>
          <div className="border-t border-[#F1EEF8] mt-3 pt-3 space-y-1 text-[#5E5A7C]">
            {order.deliveryFee > 0 && <div className="flex justify-between"><span>Delivery</span><span className="tabular-nums">{naira(order.deliveryFee)}</span></div>}
            {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span className="tabular-nums">−{naira(order.discount)}</span></div>}
            <div className="flex justify-between text-[#2B2147] font-semibold"><span>Total</span><span className="tabular-nums">{naira(order.total)}</span></div>
            <div className="flex justify-between"><span>Paid ({PAYMENT_LABEL[order.paymentMethod]})</span><span className="tabular-nums">{naira(order.amountPaid)}</span></div>
            <div className={`flex justify-between font-semibold ${bal > 0 ? 'text-[#B42318]' : 'text-[#1F6B2E]'}`}>
              <span>{bal > 0 ? 'Still owed' : 'Fully paid'}</span><span className="tabular-nums">{bal > 0 ? naira(bal) : ''}</span>
            </div>
          </div>
        </div>

        <Field label="Status">
          <select className={field} value={order.status} onChange={e => onUpdate({ status: e.target.value as OrderStatus })}>
            {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>

        {bal > 0 && (
          <div className="bg-white border border-[#E6E0F3] rounded-xl p-4 space-y-3">
            <p className="font-semibold">Record a payment</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min={0} className={field} placeholder={String(bal)} value={payment}
                onChange={e => setPayment(e.target.value === '' ? '' : Number(e.target.value))} aria-label="Amount received"/>
              <select className={field} value={method} onChange={e => setMethod(e.target.value as PaymentMethod)} aria-label="Method">
                {Object.entries(PAYMENT_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <button className={btn.primary} onClick={() => {
              const amt = payment === '' ? bal : Math.max(0, payment);
              onUpdate({ amountPaid: Math.min(order.total, order.amountPaid + amt), paymentMethod: method });
              setPayment('');
            }}>
              Save {naira(payment === '' ? bal : Number(payment) || 0)} payment
            </button>
          </div>
        )}

        <div className="pt-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-[#B42318]">Delete this order for good?</span>
              <button onClick={onDelete} className="px-3 py-1.5 rounded-lg bg-[#B42318] text-white font-semibold">Delete</button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg border border-[#D5D0E4]">Keep</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-[#B42318] text-[0.85rem] py-2 hover:underline">Delete order</button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
