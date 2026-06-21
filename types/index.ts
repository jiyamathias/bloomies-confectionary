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
  price: string;
  basePrice?: number;
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

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  qty: number;
  customisation?: string;
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
