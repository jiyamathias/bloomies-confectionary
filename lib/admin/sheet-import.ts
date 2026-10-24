// Turns rows from the old Google Sheet (downloaded as CSV) into orders.
// Column names vary from sheet to sheet, so we guess the mapping and let the owner correct it.
import { PRODUCTS } from '@/lib/products';
import type { Channel, Order, OrderStatus, PaymentMethod, ProductCategory } from '@/lib/admin/types';

export const IMPORT_FIELDS = [
  { key: 'date',     label: 'Date',              required: true,  synonyms: ['date', 'day', 'order date'] },
  { key: 'time',     label: 'Time',              required: false, synonyms: ['time', 'hour'] },
  { key: 'customer', label: 'Customer name',     required: false, synonyms: ['customer', 'name', 'client', 'buyer'] },
  { key: 'phone',    label: 'Phone',             required: false, synonyms: ['phone', 'number', 'whatsapp', 'contact', 'tel'] },
  { key: 'item',     label: 'Item / product',    required: true,  synonyms: ['item', 'product', 'order', 'description', 'cake'] },
  { key: 'qty',      label: 'Quantity',          required: false, synonyms: ['qty', 'quantity', 'units', 'pcs'] },
  { key: 'price',    label: 'Price each',        required: false, synonyms: ['unit price', 'price each', 'rate', 'price'] },
  { key: 'amount',   label: 'Total amount',      required: false, synonyms: ['total', 'amount', 'sales', 'revenue', 'value'] },
  { key: 'paid',     label: 'Amount paid',       required: false, synonyms: ['paid', 'amount paid', 'deposit', 'received'] },
  { key: 'payment',  label: 'Payment method',    required: false, synonyms: ['payment', 'paid via', 'method', 'mode'] },
  { key: 'channel',  label: 'Where it came from', required: false, synonyms: ['channel', 'source', 'platform', 'via'] },
  { key: 'status',   label: 'Status',            required: false, synonyms: ['status', 'state', 'delivered'] },
  { key: 'note',     label: 'Notes',             required: false, synonyms: ['note', 'notes', 'comment', 'remarks', 'details'] },
] as const;

export type FieldKey = typeof IMPORT_FIELDS[number]['key'];
export type Mapping = Partial<Record<FieldKey, number>>;

/** Best guess at which column holds which field, based on the header names. */
export function guessMapping(headers: string[]): Mapping {
  const h = headers.map(x => x.trim().toLowerCase());
  const used = new Set<number>();
  const map: Mapping = {};
  // exact matches first, then "contains", so "Amount paid" doesn't get taken as "Total amount"
  for (const pass of ['exact', 'contains'] as const) {
    for (const f of IMPORT_FIELDS) {
      if (map[f.key] !== undefined) continue;
      const idx = h.findIndex((col, i) => !used.has(i) &&
        f.synonyms.some(s => (pass === 'exact' ? col === s : col.includes(s))));
      if (idx >= 0) { map[f.key] = idx; used.add(idx); }
    }
  }
  return map;
}

const money = (v: string | undefined) => {
  if (!v) return NaN;
  const n = Number(v.replace(/[₦,\sNGN]/gi, '').replace(/k$/i, '000'));
  return isFinite(n) ? n : NaN;
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Accepts 24/10/2026, 24-10-26, 2026-10-24, 24 Oct 2026, Oct 24, 2026 (day first, as used in Nigeria). */
export function parseDate(dateText: string, timeText = ''): Date | null {
  const t = dateText.trim();
  let y: number, m: number, d: number;
  let match;
  if ((match = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) { y = +match[1]; m = +match[2]; d = +match[3]; }
  else if ((match = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/))) { d = +match[1]; m = +match[2]; y = +match[3]; }
  else if ((match = t.match(/^(\d{1,2})[\s-]+([a-z]{3})[a-z]*[\s-,]+(\d{2,4})/i))) { d = +match[1]; m = MONTHS.indexOf(match[2].toLowerCase()) + 1; y = +match[3]; }
  else if ((match = t.match(/^([a-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{2,4})/i))) { m = MONTHS.indexOf(match[1].toLowerCase()) + 1; d = +match[2]; y = +match[3]; }
  else return null;
  if (y < 100) y += 2000;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;

  let hh = 12, mm = 0;
  const tm = (timeText || t).match(/(\d{1,2})[:.](\d{2})\s*([ap]\.?m\.?)?/i);
  if (tm) {
    hh = +tm[1]; mm = +tm[2];
    const ap = tm[3]?.toLowerCase();
    if (ap?.startsWith('p') && hh < 12) hh += 12;
    if (ap?.startsWith('a') && hh === 12) hh = 0;
  }
  const out = new Date(y, m - 1, d, hh, mm);
  return isNaN(out.getTime()) ? null : out;
}

function paymentFrom(v = ''): PaymentMethod {
  const s = v.toLowerCase();
  if (/pos/.test(s)) return 'pos';
  if (/cash/.test(s)) return 'cash';
  if (/online|flutter|card|web/.test(s)) return 'online';
  if (/glovo|chowdeck|app/.test(s)) return 'platform';
  return 'transfer';
}
function channelFrom(v = ''): Channel {
  const s = v.toLowerCase();
  if (/walk|shop|store/.test(s)) return 'walk-in';
  if (/insta|\big\b/.test(s)) return 'instagram';
  if (/glovo/.test(s)) return 'glovo';
  if (/chowdeck/.test(s)) return 'chowdeck';
  if (/web|site|online/.test(s)) return 'website';
  return 'whatsapp';
}
function statusFrom(v: string | undefined, date: Date): OrderStatus {
  const s = (v ?? '').toLowerCase();
  if (/cancel|refund/.test(s)) return 'cancelled';
  if (/pending|not paid|awaiting/.test(s)) return 'pending';
  if (/bak|progress/.test(s)) return 'in-progress';
  if (/ready/.test(s)) return 'ready';
  if (/confirm/.test(s)) return 'confirmed';
  return date > new Date() ? 'confirmed' : 'completed';
}
function categoryFor(name: string): { category: ProductCategory; productId?: string } {
  const n = name.toLowerCase();
  const p = PRODUCTS.find(x => n.includes(x.name.toLowerCase()) || x.name.toLowerCase().includes(n));
  if (p) return { category: p.category as ProductCategory, productId: p.id };
  if (/cake/.test(n)) return { category: 'one-layer' };
  if (/pie|roll|donut|doughnut|brownie|sandwich/.test(n)) return { category: 'pastries' };
  if (/chops|puff|samosa|platter/.test(n)) return { category: 'small-chops' };
  if (/bread|slice|cupcake|loaf/.test(n)) return { category: 'daily-treats' };
  return { category: 'other' };
}

export interface ImportResult { orders: Omit<Order, 'id' | 'orderNumber'>[]; skipped: { row: number; reason: string }[] }

export function rowsToOrders(rows: string[][], map: Mapping): ImportResult {
  const orders: ImportResult['orders'] = [];
  const skipped: ImportResult['skipped'] = [];
  const get = (r: string[], k: FieldKey) => (map[k] === undefined ? undefined : r[map[k]!]?.trim());

  rows.forEach((r, i) => {
    const rowNo = i + 2; // +1 for header, +1 for 1-based rows like in Sheets
    const date = parseDate(get(r, 'date') ?? '', get(r, 'time'));
    if (!date) return skipped.push({ row: rowNo, reason: 'date not recognised' });
    const item = get(r, 'item');
    if (!item) return skipped.push({ row: rowNo, reason: 'no item' });
    const qty = Math.max(1, Math.round(money(get(r, 'qty'))) || 1);
    let total = money(get(r, 'amount'));
    let unit = money(get(r, 'price'));
    if (isNaN(total) && !isNaN(unit)) total = unit * qty;
    if (isNaN(unit) && !isNaN(total)) unit = total / qty;
    if (isNaN(total) || total < 0) return skipped.push({ row: rowNo, reason: 'amount missing' });
    const paidCol = money(get(r, 'paid'));
    const status = statusFrom(get(r, 'status'), date);
    const { category, productId } = categoryFor(item);
    const iso = date.toISOString();
    orders.push({
      createdAt: iso, dueAt: iso,
      customerName: get(r, 'customer') || 'Customer',
      customerPhone: (get(r, 'phone') ?? '').replace(/[^\d+]/g, ''),
      channel: channelFrom(get(r, 'channel')),
      fulfilment: 'pickup',
      items: [{ productId, name: item, category, qty, unitPrice: Math.round(unit) }],
      subtotal: total, deliveryFee: 0, discount: 0, total,
      amountPaid: isNaN(paidCol) ? (status === 'pending' ? 0 : total) : Math.min(paidCol, total),
      paymentMethod: paymentFrom(get(r, 'payment')),
      status, note: get(r, 'note') || undefined,
    });
  });
  return { orders, skipped };
}

export const TEMPLATE_CSV =
  'Date,Time,Customer,Phone,Item,Qty,Price each,Total,Amount paid,Payment,Channel,Status,Notes\n' +
  '24/10/2026,10:15,Chioma Okafor,08031234567,Red Velvet,1,9000,9000,9000,Transfer,WhatsApp,Delivered,Happy birthday Ada\n' +
  '24/10/2026,13:40,Walk-in customer,,Meat Pies,2,5000,10000,10000,POS,Walk-in,Done,\n';
