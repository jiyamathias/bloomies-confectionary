// Pure functions that turn orders + expenses into the numbers on the dashboard.
// They don't care where the data came from, so they work the same on sample data and on Neon results.
import {
  balanceOf, CATEGORY_LABEL, CHANNEL_LABEL, PAYMENT_LABEL,
  type Order, type Expense, type Channel,
} from '@/lib/admin/types';

export type RangeKey = 'today' | '7d' | '30d' | '90d' | '12m';
export const RANGE_LABEL: Record<RangeKey, string> = {
  today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', '12m': 'Last 12 months',
};

export interface Range { from: Date; to: Date; key: RangeKey }

export function rangeFor(key: RangeKey, now = new Date()): Range {
  const to = now;
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (key === '7d') from.setDate(from.getDate() - 6);
  if (key === '30d') from.setDate(from.getDate() - 29);
  if (key === '90d') from.setDate(from.getDate() - 89);
  if (key === '12m') { from.setMonth(from.getMonth() - 11); from.setDate(1); }
  return { from, to, key };
}

/** The same-length window just before `r`, for "vs previous period". */
export function previousRange(r: Range): Range {
  const len = r.to.getTime() - r.from.getTime();
  return { from: new Date(r.from.getTime() - len), to: new Date(r.from.getTime()), key: r.key };
}

const inRange = (iso: string, r: Range) => { const t = new Date(iso); return t >= r.from && t <= r.to; };
const live = (o: Order) => o.status !== 'cancelled';

export function ordersIn(orders: Order[], r: Range, channel: Channel | 'all' = 'all') {
  return orders.filter(o => inRange(o.createdAt, r) && (channel === 'all' || o.channel === channel));
}
export const expensesIn = (expenses: Expense[], r: Range) => expenses.filter(e => inRange(e.date, r));

export interface Kpis {
  sales: number; orders: number; avgOrder: number; collected: number; expenses: number; profit: number;
  cancelled: number; customers: number; repeatRate: number;
}

export function kpis(orders: Order[], expenses: Expense[]): Kpis {
  const ok = orders.filter(live);
  const sales = ok.reduce((s, o) => s + o.total, 0);
  const exp = expenses.reduce((s, e) => s + e.amount, 0);
  const named = ok.filter(o => o.customerPhone);
  const perCustomer = new Map<string, number>();
  named.forEach(o => perCustomer.set(o.customerPhone, (perCustomer.get(o.customerPhone) ?? 0) + 1));
  const repeaters = Array.from(perCustomer.values()).filter(n => n > 1).length;
  return {
    sales,
    orders: ok.length,
    avgOrder: ok.length ? sales / ok.length : 0,
    collected: ok.reduce((s, o) => s + o.amountPaid, 0),
    expenses: exp,
    profit: sales - exp,
    cancelled: orders.length - ok.length,
    customers: perCustomer.size,
    repeatRate: perCustomer.size ? repeaters / perCustomer.size : 0,
  };
}

export const pctChange = (now: number, before: number) => (before ? (now - before) / before : null);

export interface Point { label: string; full: string; value: number; orders: number }

/** Sales over time: hourly for today, daily up to 30 days, weekly for 90, monthly for 12 months. */
export function salesSeries(orders: Order[], r: Range): Point[] {
  const ok = orders.filter(live);
  const buckets: { start: Date; end: Date; label: string; full: string }[] = [];
  const d = new Date(r.from);
  const fmtDay = (x: Date) => x.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
  if (r.key === 'today') {
    for (let h = 7; h <= 21; h++) {
      const s = new Date(d); s.setHours(h, 0, 0, 0); const e = new Date(s); e.setHours(h + 1);
      buckets.push({ start: s, end: e, label: hourLabel(h), full: `${hourLabel(h)} – ${hourLabel(h + 1)}` });
    }
  } else if (r.key === '90d') {
    while (d <= r.to) {
      const s = new Date(d); const e = new Date(d); e.setDate(e.getDate() + 7);
      buckets.push({ start: s, end: e, label: fmtDay(s), full: `Week of ${fmtDay(s)}` }); d.setDate(d.getDate() + 7);
    }
  } else if (r.key === '12m') {
    while (d <= r.to) {
      const s = new Date(d); const e = new Date(d); e.setMonth(e.getMonth() + 1);
      buckets.push({ start: s, end: e, label: s.toLocaleDateString('en-NG', { month: 'short' }),
        full: s.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) });
      d.setMonth(d.getMonth() + 1);
    }
  } else {
    while (d <= r.to) {
      const s = new Date(d); const e = new Date(d); e.setDate(e.getDate() + 1);
      buckets.push({ start: s, end: e, label: fmtDay(s),
        full: s.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' }) });
      d.setDate(d.getDate() + 1);
    }
  }
  return buckets.map(b => {
    const inB = ok.filter(o => { const t = new Date(o.createdAt); return t >= b.start && t < b.end; });
    return { label: b.label, full: b.full, value: inB.reduce((s, o) => s + o.total, 0), orders: inB.length };
  });
}

export function hourLabel(h: number) {
  const hh = ((h + 11) % 12) + 1;
  return `${hh}${h % 24 < 12 ? 'am' : 'pm'}`;
}

/** Orders per hour of the day (7am–9pm). */
export function ordersByHour(orders: Order[]) {
  const counts = new Map<number, number>();
  orders.filter(live).forEach(o => { const h = new Date(o.createdAt).getHours(); counts.set(h, (counts.get(h) ?? 0) + 1); });
  return Array.from({ length: 15 }, (_, i) => ({ hour: i + 7, label: hourLabel(i + 7), value: counts.get(i + 7) ?? 0 }));
}

/** The busiest run of `width` consecutive hours, and what share of orders it holds. */
export function peakWindow(byHour: { hour: number; value: number }[], width = 3) {
  const total = byHour.reduce((s, h) => s + h.value, 0);
  let best = { start: byHour[0]?.hour ?? 0, count: -1 };
  for (let i = 0; i + width <= byHour.length; i++) {
    const c = byHour.slice(i, i + width).reduce((s, h) => s + h.value, 0);
    if (c > best.count) best = { start: byHour[i].hour, count: c };
  }
  return {
    start: best.start, end: best.start + width,
    label: `${hourLabel(best.start)} – ${hourLabel(best.start + width)}`,
    share: total ? best.count / total : 0,
  };
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** 7 × 15 grid: orders by weekday (Mon first) and hour. */
export function weekHourGrid(orders: Order[]) {
  const grid = Array.from({ length: 7 }, () => Array(15).fill(0) as number[]);
  orders.filter(live).forEach(o => {
    const t = new Date(o.createdAt); const h = t.getHours();
    if (h >= 7 && h <= 21) grid[(t.getDay() + 6) % 7][h - 7]++;
  });
  return grid; // row 0 = Monday
}

export function ordersByWeekday(orders: Order[]) {
  const counts = Array(7).fill(0) as number[];
  const sales = Array(7).fill(0) as number[];
  orders.filter(live).forEach(o => { const d = (new Date(o.createdAt).getDay() + 6) % 7; counts[d]++; sales[d] += o.total; });
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({ label, value: counts[i], sales: sales[i] }));
}

export function salesByCategory(orders: Order[]) {
  const m = new Map<string, number>();
  orders.filter(live).forEach(o => o.items.forEach(i => m.set(i.category, (m.get(i.category) ?? 0) + i.qty * i.unitPrice)));
  return Array.from(m.entries()).map(([k, v]) => ({ label: CATEGORY_LABEL[k as keyof typeof CATEGORY_LABEL] ?? k, value: v }))
    .sort((a, b) => b.value - a.value);
}

export function topProducts(orders: Order[], n = 8) {
  const m = new Map<string, { name: string; units: number; sales: number; orders: number }>();
  orders.filter(live).forEach(o => o.items.forEach(i => {
    const row = m.get(i.name) ?? { name: i.name, units: 0, sales: 0, orders: 0 };
    row.units += i.qty; row.sales += i.qty * i.unitPrice; row.orders++;
    m.set(i.name, row);
  }));
  return Array.from(m.values()).sort((a, b) => b.sales - a.sales).slice(0, n);
}

function shareBy<K extends string>(orders: Order[], key: (o: Order) => K, label: (k: K) => string) {
  const m = new Map<K, { orders: number; sales: number }>();
  orders.filter(live).forEach(o => {
    const k = key(o); const row = m.get(k) ?? { orders: 0, sales: 0 };
    row.orders++; row.sales += o.total; m.set(k, row);
  });
  const total = Array.from(m.values()).reduce((s, v) => s + v.sales, 0);
  return Array.from(m.entries())
    .map(([k, v]) => ({ key: k, label: label(k), orders: v.orders, value: v.sales, share: total ? v.sales / total : 0 }))
    .sort((a, b) => b.value - a.value);
}

export const salesByChannel = (orders: Order[]) => shareBy(orders, o => o.channel, k => CHANNEL_LABEL[k]);
export const salesByPayment = (orders: Order[]) => shareBy(orders, o => o.paymentMethod, k => PAYMENT_LABEL[k]);
export const salesByFulfilment = (orders: Order[]) =>
  shareBy(orders, o => o.fulfilment, k => (k === 'delivery' ? 'Delivery' : 'Pickup'));

export function expensesByCategory(expenses: Expense[]) {
  const m = new Map<string, number>();
  expenses.forEach(e => m.set(e.category, (m.get(e.category) ?? 0) + e.amount));
  return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

/** Orders still owing money, oldest due first. */
export function outstanding(orders: Order[]) {
  return orders.filter(o => balanceOf(o) > 0).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/** Open orders due in the next `days` days (including anything overdue and not completed). */
export function upcoming(orders: Order[], now = new Date(), days = 7) {
  const until = new Date(now); until.setDate(until.getDate() + days);
  return orders
    .filter(o => !['completed', 'cancelled'].includes(o.status) && new Date(o.dueAt) <= until)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export interface CustomerSummary {
  name: string; phone: string; orders: number; spent: number; firstOrder: string; lastOrder: string;
  favourite: string; channel: Channel;
}

export function customers(orders: Order[]): CustomerSummary[] {
  const m = new Map<string, { o: Order[] }>();
  orders.filter(o => live(o) && o.customerPhone).forEach(o => {
    const row = m.get(o.customerPhone) ?? { o: [] }; row.o.push(o); m.set(o.customerPhone, row);
  });
  return Array.from(m.entries()).map(([phone, { o }]) => {
    const sorted = [...o].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const fav = new Map<string, number>();
    o.forEach(x => x.items.forEach(i => fav.set(i.name, (fav.get(i.name) ?? 0) + i.qty)));
    const ch = new Map<Channel, number>();
    o.forEach(x => ch.set(x.channel, (ch.get(x.channel) ?? 0) + 1));
    return {
      name: sorted[sorted.length - 1].customerName, phone,
      orders: o.length, spent: o.reduce((s, x) => s + x.total, 0),
      firstOrder: sorted[0].createdAt, lastOrder: sorted[sorted.length - 1].createdAt,
      favourite: Array.from(fav.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '',
      channel: Array.from(ch.entries()).sort((a, b) => b[1] - a[1])[0][0],
    };
  }).sort((a, b) => b.spent - a.spent);
}

/** Plain-language observations generated from the numbers (no guesswork beyond the data). */
export function insights(cur: Order[], prev: Order[], allOrders: Order[], now = new Date()): string[] {
  const out: string[] = [];
  const k = kpis(cur, []), p = kpis(prev, []);
  const ch = pctChange(k.sales, p.sales);
  if (ch !== null && Math.abs(ch) >= 0.05) {
    out.push(`Sales are ${ch > 0 ? 'up' : 'down'} ${Math.round(Math.abs(ch) * 100)}% on the previous period.`);
  }
  const wd = ordersByWeekday(cur);
  const best = [...wd].sort((a, b) => b.value - a.value)[0];
  const quiet = [...wd].filter(d => d.label !== 'Sun').sort((a, b) => a.value - b.value)[0];
  if (best?.value) out.push(`${fullDay(best.label)} is your busiest day; ${fullDay(quiet.label)} is the quietest open day, a good day for a promo.`);
  const peak = peakWindow(ordersByHour(cur));
  if (peak.share) out.push(`${Math.round(peak.share * 100)}% of orders come in between ${peak.label}. Make sure someone is on WhatsApp then.`);
  const web = salesByChannel(cur).find(c => c.key === 'website');
  const webPrev = salesByChannel(prev).find(c => c.key === 'website');
  if (web && webPrev && web.share > webPrev.share + 0.02) {
    out.push(`Website orders grew from ${Math.round(webPrev.share * 100)}% to ${Math.round(web.share * 100)}% of sales.`);
  }
  const owed = outstanding(allOrders).filter(o => new Date(o.dueAt) < now);
  if (owed.length) {
    const sum = owed.reduce((s, o) => s + balanceOf(o), 0);
    out.push(`${owed.length} past order${owed.length > 1 ? 's' : ''} still owe ${naira(sum)} in total.`);
  }
  if (k.customers) out.push(`${Math.round(k.repeatRate * 100)}% of named customers this period ordered more than once.`);
  return out;
}

const fullDay = (d: string) => ({ Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }[d] ?? d);

export function naira(n: number, compact = false) {
  if (compact && Math.abs(n) >= 1000) {
    if (Math.abs(n) >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(/\.0+$/, '')}M`;
    return `₦${Math.round(n / 1000)}K`;
  }
  return `₦${Math.round(n).toLocaleString('en-NG')}`;
}

// ── CSV (export for accountants / import from the old Google Sheet) ─────────────────────────
const esc = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const head = Object.keys(rows[0]);
  return [head.join(','), ...rows.map(r => head.map(h => esc(r[h])).join(','))].join('\n');
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}
