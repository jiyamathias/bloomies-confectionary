export type ProductCategory =
  | 'one-layer'
  | 'bigger-cakes'
  | 'pastries'
  | 'small-chops'
  | 'daily-treats'
  | 'events';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  basePrice?: number;
  image: string;
  category: ProductCategory;
  badge?: string;
  badge_color?: 'rose' | 'green' | 'mauve';
  in_stock: boolean;
  moq?: string;
  featured: boolean;
  sort_order: number;
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
