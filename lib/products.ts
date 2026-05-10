import type { Product, GalleryItem } from '@/types';

export const PRODUCTS: Product[] = [
  // ── One-Layer Cakes ────────────────────────────────────────────────────────
  {
    id: 'ol-1', name: 'Vanilla Bloom', category: 'one-layer',
    description: 'Light, airy vanilla sponge with your choice of buttercream or whipped cream icing. Perfect for same-day celebrations.',
    price: 'From ₦8,500', basePrice: 8500,
    image: '/images/cake-vanilla.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: true, sort_order: 1,
  },
  {
    id: 'ol-2', name: 'Chocolate Fudge', category: 'one-layer',
    description: 'Rich dark chocolate sponge, indulgently moist. Available in buttercream or whipped cream.',
    price: 'From ₦9,500', basePrice: 9500,
    image: '/images/cake-chocolate.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: true, sort_order: 2,
  },
  {
    id: 'ol-3', name: 'Red Velvet', category: 'one-layer',
    description: 'Signature red velvet with cream cheese — crowd-pleaser, every time.',
    price: 'From ₦9,000', basePrice: 9000,
    image: '/images/cake-redvelvet.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: true, sort_order: 3,
  },
  {
    id: 'ol-4', name: 'Carrot Cake', category: 'one-layer',
    description: 'Moist spiced carrot sponge with cinnamon hints and cream cheese frosting.',
    price: 'From ₦11,000', basePrice: 11000,
    image: '/images/cake-carrot.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: false, featured: false, sort_order: 4,
  },

  // ── Bigger / Custom Cakes ─────────────────────────────────────────────────
  {
    id: 'bc-1', name: 'Chocolate Drip', category: 'bigger-cakes',
    description: 'Luxurious ganache drips cascading over smooth tiers — a showstopper. Available 6″–12″.',
    price: 'From ₦22,000', basePrice: 22000,
    image: '/images/cake-drip.jpg',
    badge: 'Popular', badge_color: 'rose', in_stock: true, featured: true, sort_order: 1,
  },
  {
    id: 'bc-2', name: 'Wafer Paper Cake', category: 'bigger-cakes',
    description: 'Delicate wafer paper florals and artistic flair for the most special occasions.',
    price: 'From ₦25,000', basePrice: 25000,
    image: '/images/cake-wafer.jpg',
    in_stock: true, featured: false, sort_order: 2,
  },
  {
    id: 'bc-3', name: 'Ombré Cake', category: 'bigger-cakes',
    description: 'Beautiful colour gradients blended to perfection. Pastel to bold — your choice.',
    price: 'From ₦20,000', basePrice: 20000,
    image: '/images/cake-ombre.jpg',
    in_stock: true, featured: true, sort_order: 3,
  },
  {
    id: 'bc-4', name: 'Picture / Photo Cake', category: 'bigger-cakes',
    description: 'Your photo printed on an edible sheet. Perfect for birthdays and milestones.',
    price: 'From ₦28,000', basePrice: 28000,
    image: '/images/cake-photo.jpg',
    badge: 'Trending', badge_color: 'mauve', in_stock: true, featured: false, sort_order: 4,
  },
  {
    id: 'bc-5', name: 'Leopard Print Cake', category: 'bigger-cakes',
    description: 'Bold, eye-catching leopard print design — a statement cake that turns heads.',
    price: 'From ₦24,000', basePrice: 24000,
    image: '/images/cake-custom.jpg',
    in_stock: true, featured: false, sort_order: 5,
  },

  // ── Pastries ──────────────────────────────────────────────────────────────
  {
    id: 'pa-1', name: 'Meat Pies', category: 'pastries',
    description: 'Flaky golden pastry filled with seasoned minced meat and vegetables.',
    price: '₦5,000 (10pcs)', image: '/images/pastry-meatpie.jpg', moq: 'MOQ: 10 pieces',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: true, sort_order: 1,
  },
  {
    id: 'pa-2', name: 'Chicken Pie', category: 'pastries',
    description: 'Tender chicken filling wrapped in a buttery, melt-in-your-mouth crust.',
    price: 'From ₦600', image: '/images/pastry-chickenpie.jpg',
    in_stock: true, featured: false, sort_order: 2,
  },
  {
    id: 'pa-3', name: 'Sausage Rolls', category: 'pastries',
    description: 'Crispy rolls packed with spiced sausage filling. Irresistibly golden.',
    price: '₦4,500 (10pcs)', image: '/images/pastry-sausageroll.jpg', moq: 'MOQ: 10 pieces',
    badge: 'Popular', badge_color: 'rose', in_stock: true, featured: true, sort_order: 3,
  },
  {
    id: 'pa-4', name: 'Donuts', category: 'pastries',
    description: 'Fluffy glazed rings dusted with sugar or filled with jam and cream.',
    price: '₦3,500 (6pcs)', image: '/images/pastry-donuts.jpg', moq: 'MOQ: 6 pieces',
    in_stock: true, featured: false, sort_order: 4,
  },
  {
    id: 'pa-5', name: 'Cinnamon Rolls', category: 'pastries',
    description: 'Warm pillowy rolls swirled with cinnamon sugar and drizzled with vanilla glaze.',
    price: '₦6,000 (10pcs)', image: '/images/pastry-cinnamon.jpg', moq: 'MOQ: 10 pieces',
    badge: 'New', badge_color: 'mauve', in_stock: true, featured: true, sort_order: 5,
  },
  {
    id: 'pa-6', name: 'Brownies', category: 'pastries',
    description: 'Fudgy, dense chocolate brownies with a perfectly crinkly top.',
    price: 'From ₦1,500', image: '/images/pastry-brownies.jpg',
    in_stock: true, featured: false, sort_order: 6,
  },
  {
    id: 'pa-7', name: 'Sandwiches', category: 'pastries',
    description: 'Freshly made with premium fillings. Perfect for breakfast or a quick snack.',
    price: 'From ₦1,200', image: '/images/pastry-sandwich.jpg',
    in_stock: true, featured: false, sort_order: 7,
  },
  {
    id: 'pa-8', name: 'Pastry Gift Box', category: 'pastries',
    description: 'A curated selection of our finest pastries, elegantly boxed for gifting.',
    price: 'From ₦12,000', image: '/images/pastry-giftbox.jpg',
    badge: 'Gift', badge_color: 'rose', in_stock: true, featured: false, sort_order: 8,
  },

  // ── Small Chops ───────────────────────────────────────────────────────────
  {
    id: 'sc-1', name: 'Starter Pack', category: 'small-chops',
    description: 'For 10–20 guests. Puff puff, spring rolls, samosa and more.',
    price: 'From ₦15,000', image: '/images/smallchops-starter.jpg',
    in_stock: true, featured: false, sort_order: 1,
  },
  {
    id: 'sc-2', name: 'Party Pack', category: 'small-chops',
    description: 'For 30–50 guests. Full variety combo with serving trays included.',
    price: 'From ₦35,000', image: '/images/smallchops-party.jpg',
    badge: 'Popular', badge_color: 'rose', in_stock: true, featured: false, sort_order: 2,
  },
  {
    id: 'sc-3', name: 'Premium Event', category: 'small-chops',
    description: '100+ guests. Full buffet spread with dedicated service.',
    price: 'Custom Pricing', image: '/images/smallchops-premium.jpg',
    in_stock: true, featured: false, sort_order: 3,
  },

  // ── Daily Treats ──────────────────────────────────────────────────────────
  {
    id: 'dt-1', name: 'Cake Slices', category: 'daily-treats',
    description: 'Generous slices of our freshly baked cakes, available every day.',
    price: 'From ₦1,500', image: '/images/treat-slice.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: false, sort_order: 1,
  },
  {
    id: 'dt-2', name: 'Cake Loaves', category: 'daily-treats',
    description: 'Beautifully moist loaf cakes — perfect for sharing or gifting.',
    price: 'From ₦4,500', image: '/images/treat-loaf.jpg',
    badge: '⚡ Same Day', badge_color: 'green', in_stock: true, featured: false, sort_order: 2,
  },
  {
    id: 'dt-3', name: 'Banana Bread', category: 'daily-treats',
    description: 'Our signature banana bread — moist, fragrant, and utterly irresistible.',
    price: 'From ₦3,500', image: '/images/treat-banana.jpg',
    badge: 'Fan Fave', badge_color: 'rose', in_stock: true, featured: true, sort_order: 3,
  },
  {
    id: 'dt-4', name: 'Tres Leches', category: 'daily-treats',
    description: 'Luscious three-milk cake soaked to perfection. Light and heavenly.',
    price: 'From ₦2,500', image: '/images/treat-treeleches.jpg',
    in_stock: true, featured: false, sort_order: 4,
  },
  {
    id: 'dt-5', name: 'Cupcakes', category: 'daily-treats',
    description: 'Beautifully decorated cupcakes in assorted flavours.',
    price: 'From ₦1,200', image: '/images/treat-cupcake.jpg',
    in_stock: true, featured: false, sort_order: 5,
  },
  {
    id: 'dt-6', name: 'Sandwiches', category: 'daily-treats',
    description: 'Freshly made daily with premium fillings.',
    price: 'From ₦1,200', image: '/images/pastry-sandwich.jpg',
    in_stock: true, featured: false, sort_order: 6,
  },

  // ── Events ────────────────────────────────────────────────────────────────
  {
    id: 'ev-1', name: 'Premium Treat Boxes', category: 'events',
    description: 'Beautifully curated boxes of our finest pastries and confections — perfect for gifting and corporate appreciation.',
    price: 'Custom Pricing', image: '/images/events-treatbox.jpg',
    badge: 'Most Popular', badge_color: 'rose', in_stock: true, featured: false, sort_order: 1,
  },
  {
    id: 'ev-2', name: 'Office Breakfast Boxes', category: 'events',
    description: 'Start the workday right. Freshly baked pastries and treats delivered directly to your office.',
    price: 'Custom Pricing', image: '/images/events-cupcakebox.jpg',
    in_stock: true, featured: false, sort_order: 2,
  },
  {
    id: 'ev-3', name: 'Small Chops Event Catering', category: 'events',
    description: 'Full small chops catering for weddings, parties, and corporate events. We handle everything.',
    price: 'Via WhatsApp', image: '/images/events-bulkorder.jpg',
    badge: 'Events', badge_color: 'mauve', in_stock: true, featured: false, sort_order: 3,
  },
  {
    id: 'ev-4', name: 'Bulk Custom Packages', category: 'events',
    description: 'Large-scale custom orders for conferences, product launches, and large celebrations. MOQ applies.',
    price: 'Custom Pricing', image: '/images/cat-events.jpg',
    in_stock: true, featured: false, sort_order: 4,
  },
];

export const GALLERY: GalleryItem[] = [
  { id: 'g1',  title: 'Vintage Violet',      image: '/images/gallery-1.jpg', category: 'Custom Cake'   },
  { id: 'g2',  title: 'Lilac Dream',          image: '/images/gallery-2.jpg', category: 'Bigger Cake'   },
  { id: 'g3',  title: 'Blush Romance',        image: '/images/gallery-3.jpg', category: 'One Layer'     },
  { id: 'g4',  title: 'Pure Elegance',        image: '/images/gallery-4.jpg', category: 'Custom Cake'   },
  { id: 'g5',  title: 'Berry Luxe',           image: '/images/gallery-5.jpg', category: 'Bigger Cake'   },
  { id: 'g6',  title: 'Soft Petal',           image: '/images/gallery-6.jpg', category: 'One Layer'     },
  { id: 'g7',  title: 'Lavender Haze',        image: '/images/gallery-7.jpg', category: 'Custom Cake'   },
  { id: 'g8',  title: 'Rose Garden',          image: '/images/gallery-8.jpg', category: 'Bigger Cake'   },
  { id: 'g9',  title: 'Dusty Orchid',         image: '/images/gallery-9.jpg', category: 'One Layer'     },
  { id: 'g10', title: 'Chocolate Indulgence', image: '/images/cake-chocolate.jpg', category: 'Bigger Cake' },
  { id: 'g11', title: 'Red Velvet Love',      image: '/images/cake-redvelvet.jpg', category: 'One Layer'  },
  { id: 'g12', title: 'Drip Queen',           image: '/images/cake-drip.jpg',   category: 'Custom Cake'  },
];

export function getProducts(category?: string): Product[] {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// ── Best Sellers Section ──────────────────────────────────────────────────────
// These are stored locally and editable from the admin dashboard.
// IDs must match product IDs in PRODUCTS array above.

export interface BestSellersConfig {
  title: string;
  productIds: string[];
}

export const DEFAULT_BEST_SELLERS: BestSellersConfig = {
  title: 'Best Sellers',
  productIds: ['ol-1', 'ol-2', 'pa-3', 'bc-1', 'dt-3', 'pa-5'],
};

// LocalStorage key used by admin to persist changes
export const BEST_SELLERS_STORAGE_KEY = 'bloomies_best_sellers';

// Helper: read best sellers config (with localStorage override in browser)
export function getBestSellersConfig(): BestSellersConfig {
  if (typeof window === 'undefined') return DEFAULT_BEST_SELLERS;
  try {
    const stored = localStorage.getItem(BEST_SELLERS_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as BestSellersConfig;
  } catch {}
  return DEFAULT_BEST_SELLERS;
}

// Helper: save best sellers config to localStorage
export function saveBestSellersConfig(config: BestSellersConfig): void {
  try {
    localStorage.setItem(BEST_SELLERS_STORAGE_KEY, JSON.stringify(config));
  } catch {}
}
