// Shapes of the admin data. These mirror the planned Neon Postgres tables (orders, order_items,
// expenses), so the sample data used in this preview can later be swapped for real queries.

export type Channel = 'website' | 'whatsapp' | 'walk-in' | 'instagram' | 'glovo' | 'chowdeck';
export type PaymentMethod = 'online' | 'transfer' | 'pos' | 'cash' | 'platform';
export type OrderStatus = 'pending' | 'confirmed' | 'in-progress' | 'ready' | 'completed' | 'cancelled';
export type Fulfilment = 'pickup' | 'delivery';
export type ProductCategory = 'one-layer' | 'bigger-cakes' | 'pastries' | 'small-chops' | 'daily-treats' | 'events' | 'other';

export interface OrderItem {
  productId?: string;
  name: string;
  category: ProductCategory;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  /** When the order was placed (ISO string) */
  createdAt: string;
  /** When it's due for pickup/delivery (ISO string) */
  dueAt: string;
  customerName: string;
  customerPhone: string;
  channel: Channel;
  fulfilment: Fulfilment;
  deliveryAddress?: string;
  items: OrderItem[];
  /** Sum of items, in naira */
  subtotal: number;
  deliveryFee: number;
  discount: number;
  /** subtotal + deliveryFee − discount */
  total: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  note?: string;
}

export type ExpenseCategory =
  | 'Ingredients' | 'Packaging' | 'Staff' | 'Rent & utilities' | 'Gas & power'
  | 'Delivery' | 'Marketing' | 'Equipment' | 'Other';

export interface Expense {
  id: string;
  /** ISO date */
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: Exclude<PaymentMethod, 'online' | 'platform'>;
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  website: 'Website', whatsapp: 'WhatsApp', 'walk-in': 'Walk-in',
  instagram: 'Instagram', glovo: 'Glovo', chowdeck: 'Chowdeck',
};
export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  online: 'Online (Flutterwave)', transfer: 'Bank transfer', pos: 'POS', cash: 'Cash', platform: 'Paid via app',
};
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending', confirmed: 'Confirmed', 'in-progress': 'Baking', ready: 'Ready',
  completed: 'Completed', cancelled: 'Cancelled',
};
export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  'one-layer': 'One-layer cakes', 'bigger-cakes': 'Celebration cakes', pastries: 'Pastries',
  'small-chops': 'Small chops', 'daily-treats': 'Daily treats', events: 'Events', other: 'Other',
};
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Ingredients', 'Packaging', 'Staff', 'Rent & utilities', 'Gas & power', 'Delivery', 'Marketing', 'Equipment', 'Other',
];

export const balanceOf = (o: Pick<Order, 'total' | 'amountPaid' | 'status'>) =>
  o.status === 'cancelled' ? 0 : Math.max(o.total - o.amountPaid, 0);
