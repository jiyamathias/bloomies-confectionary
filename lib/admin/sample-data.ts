// PREVIEW ONLY: generates a year of realistic-looking orders and expenses so the owner can see the
// dashboard working before the Neon database is connected. Same seed → same data on every load.
import { PRODUCTS } from '@/lib/products';
import type {
  Order, OrderItem, Expense, Channel, PaymentMethod, ProductCategory, OrderStatus, ExpenseCategory,
} from '@/lib/admin/types';

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(r: () => number, weighted: [T, number][]): T {
  const total = weighted.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of weighted) { if ((x -= w) < 0) return v; }
  return weighted[weighted.length - 1][0];
}

const FIRST = ['Adaeze','Chioma','Emeka','Fatima','Tobi','Ngozi','Ifeanyi','Blessing','Kelechi','Amaka','Tunde','Zainab',
  'Chinedu','Ebere','Ibrahim','Funke','Obinna','Precious','Uche','Bisi','Somto','Halima','Nnamdi','Ada','Ese','Kemi',
  'Daniel','Grace','Victor','Joy','Samuel','Mercy','David','Esther','Godwin','Faith','Chidi','Ruth','Ibinabo','Tamuno',
  'Ibiso','Boma','Soye','Data','Owanari','Belema','Ipalibo','Sotonye'];
const LAST = ['Okafor','Eze','Nwosu','Bello','Adeyemi','Okeke','Ibe','George','Amadi','Wokoma','Briggs','Jumbo','Horsfall',
  'Ogbonna','Uzoma','Nwachukwu','Johnson','Daniels','Ekeh','Obi','Princewill','Alalibo','Dappa','Iyalla'];

const HOUR_WEIGHTS: [number, number][] = [
  [7, 2], [8, 4], [9, 7], [10, 11], [11, 13], [12, 12], [13, 9], [14, 6], [15, 6],
  [16, 9], [17, 10], [18, 6], [19, 4], [20, 3], [21, 2],
];
const DOW_FACTOR = [0.25, 0.8, 0.85, 0.9, 1.0, 1.25, 1.5]; // Sun..Sat (closed Sundays: online/WhatsApp only)

function numberFrom(label: string) {
  const m = label.replace(/,/g, '').match(/\d+/);
  return m ? Number(m[0]) : 0;
}

const PRODUCTS_BY_CAT = (cat: string) => PRODUCTS.filter(p => p.category === cat);

function itemFor(r: () => number, cat: ProductCategory): OrderItem {
  const list = PRODUCTS_BY_CAT(cat);
  const p = list[Math.floor(r() * list.length)];
  const listed = p.unitPrice ?? p.basePrice ?? numberFrom(p.price);
  let unitPrice = listed;
  let qty = 1;
  switch (cat) {
    case 'one-layer':    unitPrice = listed + pick(r, [[0, 6], [2000, 3], [3000, 2], [6000, 1]]); break;
    case 'bigger-cakes': unitPrice = Math.round(listed * pick(r, [[1, 4], [1.4, 3], [1.9, 2], [2.6, 1]]) / 500) * 500; break;
    case 'pastries':     qty = pick(r, [[1, 4], [2, 4], [3, 2], [5, 1]]); unitPrice = listed || 5000; break;
    case 'daily-treats': qty = pick(r, [[1, 4], [2, 3], [3, 2], [6, 1]]); unitPrice = listed || 1500; break;
    case 'small-chops':  unitPrice = listed || Math.round((80000 + r() * 70000) / 5000) * 5000; break;
    case 'events':       unitPrice = Math.round((45000 + r() * 135000) / 5000) * 5000; qty = 1; break;
  }
  return { productId: p.id, name: p.name, category: cat, qty, unitPrice };
}

export interface SampleData { orders: Order[]; expenses: Expense[] }

export function generateSampleData(now = new Date()): SampleData {
  const r = mulberry32(20261024);
  const customers = Array.from({ length: 900 }, (_, i) => ({
    name: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`,
    phone: `080${String(10000000 + Math.floor(r() * 89999999))}`,
    area: pick(r, [['GRA Phase 2', 3], ['Rumuola', 3], ['Mgbuoba', 4], ['Woji', 2], ['Trans-Amadi', 2], ['D-Line', 2], ['Ada George', 3], ['Eliozu', 2]]),
    i,
  }));

  const orders: Order[] = [];
  const days = 365;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let seq = 1200;

  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today); day.setDate(today.getDate() - d);
    const progress = 1 - d / days;                 // 0 → 1 across the year
    const growth = 0.72 + progress * 0.55;          // the business grows ~75% over the year
    const m = day.getMonth(), date = day.getDate();
    const season =
      (m === 11 && date <= 24 ? 1.6 : 1) *
      (m === 1 && date >= 10 && date <= 14 ? 2.2 : 1) *
      (m === 2 && date >= 15 ? 1.25 : 1);
    const expected = 8 * growth * DOW_FACTOR[day.getDay()] * season;
    const count = Math.max(0, Math.round(expected * (0.7 + r() * 0.6)));
    const websiteShare = 0.06 + progress * 0.22;   // online ordering takes off over the year

    for (let k = 0; k < count; k++) {
      const channel: Channel = pick<Channel>(r, [
        ['whatsapp', 50 * (1 - websiteShare)], ['website', 100 * websiteShare], ['walk-in', 18],
        ['instagram', 6], ['glovo', 4], ['chowdeck', 5],
      ]);
      const hour = pick(r, channel === 'walk-in' ? HOUR_WEIGHTS.filter(([h]) => h >= 8 && h <= 16) : HOUR_WEIGHTS);
      if (day.getDay() === 0 && channel === 'walk-in') continue;
      const created = new Date(day); created.setHours(hour, Math.floor(r() * 60), Math.floor(r() * 60));
      if (created > now) continue;

      const cat = pick<ProductCategory>(r, [
        ['daily-treats', 30], ['pastries', 30], ['one-layer', 20], ['bigger-cakes', 9], ['small-chops', 6], ['events', 1.5],
      ]);
      const items = [itemFor(r, cat)];
      if (r() < 0.35 && cat !== 'events') items.push(itemFor(r, pick(r, [['daily-treats', 1], ['pastries', 1]] as [ProductCategory, number][])));
      const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

      const big = ['bigger-cakes', 'small-chops', 'events', 'one-layer'].includes(cat);
      const fulfilment = channel === 'walk-in' ? 'pickup' : r() < (big ? 0.7 : 0.35) ? 'delivery' : 'pickup';
      const deliveryFee = fulfilment === 'delivery' ? pick(r, [[1500, 3], [2000, 4], [2500, 3], [3500, 2], [5000, 1]]) : 0;
      const discount = r() < 0.04 ? Math.round(subtotal * 0.1 / 100) * 100 : 0;
      const total = subtotal + deliveryFee - discount;

      const leadDays = cat === 'bigger-cakes' || cat === 'events' ? 2 + Math.floor(r() * 9)
        : cat === 'small-chops' ? 1 + Math.floor(r() * 6)
        : cat === 'one-layer' ? (r() < 0.45 ? 0 : 1 + Math.floor(r() * 4)) : 0;
      const due = new Date(created); due.setDate(due.getDate() + leadDays);
      if (leadDays > 0) due.setHours(pick(r, [[10, 2], [12, 3], [14, 3], [16, 2]]), 0, 0);

      const paymentMethod: PaymentMethod =
        channel === 'website' ? 'online'
        : channel === 'glovo' || channel === 'chowdeck' ? 'platform'
        : channel === 'walk-in' ? pick(r, [['pos', 50], ['cash', 35], ['transfer', 15]])
        : pick(r, [['transfer', 85], ['pos', 10], ['cash', 5]]);

      let status: OrderStatus = 'completed';
      if (due > now) status = pick(r, [['confirmed', 5], ['in-progress', 2], ['pending', 1]]);
      else if (due.toDateString() === now.toDateString()) status = pick(r, [['ready', 3], ['completed', 2]]);
      if (channel === 'walk-in' && due <= now) status = 'completed';
      if (r() < 0.03) status = 'cancelled';

      // Big custom orders take a 50% deposit; the balance is paid before the cake leaves the kitchen.
      let amountPaid = total;
      if (status !== 'completed' && status !== 'cancelled' && total >= 40000 && paymentMethod === 'transfer') {
        amountPaid = Math.round(total / 2 / 100) * 100;
      }
      if (status === 'completed' && d < 75 && r() < 0.02) amountPaid = Math.round(total * 0.5 / 100) * 100; // balance not yet collected

      // New customers keep arriving through the year; earlier ones become regulars.
      const known = Math.min(customers.length, Math.floor(60 + progress * 780));
      const c = customers[Math.floor(Math.pow(r(), 1.25) * known)];
      const anonymousWalkIn = channel === 'walk-in' && r() < 0.55;
      orders.push({
        id: `ord_${seq}`,
        orderNumber: `BLM-${seq++}`,
        createdAt: created.toISOString(),
        dueAt: (leadDays ? due : created).toISOString(),
        customerName: anonymousWalkIn ? 'Walk-in customer' : c.name,
        customerPhone: anonymousWalkIn ? '' : c.phone,
        channel, fulfilment,
        deliveryAddress: fulfilment === 'delivery' ? c.area : undefined,
        items, subtotal, deliveryFee, discount, total, amountPaid, paymentMethod, status,
      });
    }
  }

  // Expenses, roughly in line with sales so the profit numbers look believable.
  const expenses: Expense[] = [];
  let eseq = 1;
  const addExpense = (date: Date, category: ExpenseCategory, description: string, amount: number,
    paymentMethod: Expense['paymentMethod'] = 'transfer') => {
    if (date > now) return;
    expenses.push({ id: `exp_${eseq++}`, date: date.toISOString(), category, description, amount: Math.round(amount / 100) * 100, paymentMethod });
  };
  const salesBetween = (from: Date, to: Date) => orders
    .filter(o => o.status !== 'cancelled' && new Date(o.createdAt) >= from && new Date(o.createdAt) < to)
    .reduce((s, o) => s + o.subtotal, 0);

  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today); day.setDate(today.getDate() - d); day.setHours(9, 30);
    const weekAgo = new Date(day); weekAgo.setDate(day.getDate() - 7);
    if (day.getDay() === 1) {
      const lastWeek = salesBetween(weekAgo, day);
      addExpense(day, 'Ingredients', 'Flour, sugar, butter, eggs (weekly market run)', lastWeek * (0.33 + r() * 0.06), 'cash');
      addExpense(day, 'Gas & power', 'Cooking gas and diesel', 28000 + r() * 12000, 'cash');
    }
    if (day.getDay() === 4) {
      addExpense(day, 'Ingredients', 'Cream, chocolate, fillings', salesBetween(weekAgo, day) * (0.08 + r() * 0.03));
      addExpense(day, 'Delivery', 'Dispatch rider payments', orders
        .filter(o => new Date(o.createdAt) >= weekAgo && new Date(o.createdAt) < day)
        .reduce((s, o) => s + o.deliveryFee, 0) * 0.85);
    }
    if (day.getDate() === 3) addExpense(day, 'Packaging', 'Cake boxes, pastry bags, labels', 70000 + r() * 50000);
    if (day.getDate() === 17) addExpense(day, 'Packaging', 'Cake boards and boxes top-up', 30000 + r() * 30000);
    if (day.getDate() === 1) addExpense(day, 'Rent & utilities', 'Shop rent and electricity', 230000);
    if (day.getDate() === 28) addExpense(day, 'Staff', 'Salaries (4 staff)', 560000);
    if (day.getDate() === 10 && r() < 0.7) addExpense(day, 'Marketing', pick(r, [['Instagram ads', 2], ['Flyers and promo boxes', 1], ['Influencer collaboration', 1]]), 25000 + r() * 45000);
    if (r() < 0.012) addExpense(day, 'Equipment', pick(r, [['Mixer repair', 1], ['New baking pans', 2], ['Piping tools and turntable', 1]]), 15000 + r() * 85000);
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  expenses.sort((a, b) => b.date.localeCompare(a.date));
  return { orders, expenses };
}
