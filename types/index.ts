export type ProductCategory =
  | 'one-layer'
  | 'bigger-cakes'
  | 'pastries'
  | 'small-chops'
  | 'daily-treats'
  | 'events';

// Customization fields that an admin can enable per cake
export type OneLayerCustomField =
  | 'flavour'
  | 'icing'
  | 'colour'
  | 'message'
  | 'occasion'
  | 'gender'
  | 'delivery'
  | 'addon_card'
  | 'addon_chamdor'
  | 'addon_candles'
  | 'notes';

export type BiggerCakeCustomField =
  | 'size_layers'
  | 'flavour_regular'
  | 'flavour_deluxe'
  | 'colour'
  | 'topper'
  | 'occasion'
  | 'gender'
  | 'delivery'
  | 'addon_card'
  | 'addon_chamdor'
  | 'addon_candles'
  | 'notes';

export type CakeCustomField = OneLayerCustomField | BiggerCakeCustomField;

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price label shown to customers, e.g. "From ₦8,500" or "₦5,000 (10pcs)" */
  price: string;
  basePrice?: number;
  /** Exact price in naira for non-cake items. Set this to allow online payment; leave it out for "From…" or custom-priced items. */
  unitPrice?: number;
  image: string;
  // Optional additional photos for the multi-image gallery view (main + toggle).
  // `image` above always acts as the cover/fallback when this is empty.
  images?: string[];
  category: ProductCategory;
  badge?: string;
  badge_color?: 'rose' | 'green' | 'mauve';
  in_stock: boolean;
  moq?: string;
  featured: boolean;
  sort_order: number;
  // Which customization fields are enabled for this cake (undefined = all enabled for backward compat)
  customizationOptions?: CakeCustomField[];
  // Design style set by admin at creation time (bigger cakes only) — shown to customer as info
  designStyle?: string;
  // Admin-defined colour options the customer can pick from
  cakeColors?: string[];
  // Admin-defined size options with per-size pricing
  cakeSizes?: { label: string; price: number }[];
}

/** The cake choices that affect price. Sent to the server so it can recalculate the total. */
export interface CakeOptions {
  size?: string;
  icing?: 'buttercream' | 'whipped-cream';
  flavours?: string[];
  card?: boolean;
  chamdor?: boolean;
  candles?: number;
}

export interface CartItem {
  id: string;
  name: string;
  /** Price label shown in the cart */
  price: string;
  image: string;
  qty: number;
  customisation?: string;
  /** Catalogue id, used by the server to look up the real price */
  productId?: string;
  options?: CakeOptions;
  /** Price per unit in naira if it can be paid online, otherwise null (needs a quote) */
  unitPrice?: number | null;
  /** Full order details (message on cake, date, notes…) for the bakery */
  details?: string;
}

export interface AddOnSelection {
  card: boolean;
  cardMessage: string;
  chamdor: boolean;
  candles: number;
}

export const ADDON_PRICES = {
  card: 3000,
  chamdor: 6000,
  candlePerUnit: 500,
} as const;

export const ICING_SURCHARGE: Record<string, number> = {
  buttercream: 0,
  'whipped-cream': 2000,
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  category: string;
};
