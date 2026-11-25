// Database tables (Neon Postgres via Drizzle ORM).
// Generate a migration after changing this file:  npm run db:generate
import {
  pgTable, text, integer, boolean, timestamp, jsonb, uuid, index, uniqueIndex, date, serial,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();

// ── Admin accounts & sessions ─────────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['owner', 'staff'] }).notNull().default('owner'),
  createdAt: createdAt(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
}, t => [uniqueIndex('admin_users_email_idx').on(sql`lower(${t.email})`)]);

export const sessions = pgTable('sessions', {
  /** SHA-256 of the cookie token (the raw token is never stored). */
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
}, t => [index('sessions_user_idx').on(t.userId)]);

// ── Catalogue ─────────────────────────────────────────────────────────────────────────────────
export const products = pgTable('products', {
  id: text('id').primaryKey(),                       // e.g. "ol-1" or a generated slug
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull(),             // one-layer | bigger-cakes | pastries | small-chops | daily-treats | events
  priceLabel: text('price_label').notNull().default(''),
  basePrice: integer('base_price'),                 // cakes: starting price in naira
  unitPrice: integer('unit_price'),                 // fixed-price items: exact price, enables online payment
  image: text('image').notNull().default(''),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  badge: text('badge'),
  badgeColor: text('badge_color').notNull().default('rose'),
  inStock: boolean('in_stock').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  moq: text('moq'),
  customizationOptions: jsonb('customization_options').$type<string[] | null>(),
  designStyle: text('design_style'),
  cakeColors: jsonb('cake_colors').$type<string[] | null>(),
  cakeSizes: jsonb('cake_sizes').$type<{ label: string; price: number }[] | null>(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, t => [index('products_category_idx').on(t.category, t.sortOrder)]);

export const galleryItems = pgTable('gallery_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: createdAt(),
});

// ── Website content & settings ────────────────────────────────────────────────────────────────
/** CMS content: one row "draft", one row "published". `data` holds only what differs from the defaults. */
export const siteContent = pgTable('site_content', {
  id: text('id', { enum: ['draft', 'published'] }).primaryKey(),
  data: jsonb('data').$type<Record<string, Record<string, Record<string, unknown>>>>().notNull().default({}),
  updatedAt: updatedAt(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id, { onDelete: 'set null' }),
});

/** Small key/value settings, e.g. "best_sellers". */
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: updatedAt(),
});

// ── Orders, payments, expenses ────────────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: serial('number').notNull(),               // shown as BLM-<number>
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
  customerName: text('customer_name').notNull().default(''),
  customerPhone: text('customer_phone').notNull().default(''),
  customerEmail: text('customer_email'),
  channel: text('channel').notNull(),               // website | whatsapp | walk-in | instagram | glovo | chowdeck
  fulfilment: text('fulfilment').notNull().default('pickup'),
  deliveryAddress: text('delivery_address'),
  subtotal: integer('subtotal').notNull().default(0),
  deliveryFee: integer('delivery_fee').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  total: integer('total').notNull().default(0),
  amountPaid: integer('amount_paid').notNull().default(0),
  paymentMethod: text('payment_method').notNull().default('transfer'),
  status: text('status').notNull().default('pending'),
  note: text('note'),
  source: text('source').notNull().default('admin'), // website | admin | import
  /** Flutterwave reference for website orders. */
  txRef: text('tx_ref'),
  flwTransactionId: text('flw_transaction_id'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  updatedAt: updatedAt(),
}, t => [
  uniqueIndex('orders_number_idx').on(t.number),
  uniqueIndex('orders_tx_ref_idx').on(t.txRef),
  index('orders_created_idx').on(t.createdAt),
  index('orders_due_idx').on(t.dueAt),
  index('orders_phone_idx').on(t.customerPhone),
]);

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id'),
  name: text('name').notNull(),
  category: text('category').notNull().default('other'),
  qty: integer('qty').notNull(),
  unitPrice: integer('unit_price').notNull(),
  details: text('details'),
  options: jsonb('options').$type<Record<string, unknown> | null>(),
}, t => [index('order_items_order_idx').on(t.orderId)]);

/** Every payment received against an order (deposit, balance, online payment…). */
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  method: text('method').notNull(),
  reference: text('reference'),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  recordedBy: uuid('recorded_by').references(() => adminUsers.id, { onDelete: 'set null' }),
}, t => [index('payments_order_idx').on(t.orderId), uniqueIndex('payments_reference_idx').on(t.reference)]);

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date', { mode: 'string' }).notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method').notNull().default('transfer'),
  createdAt: createdAt(),
  createdBy: uuid('created_by').references(() => adminUsers.id, { onDelete: 'set null' }),
}, t => [index('expenses_date_idx').on(t.date)]);
