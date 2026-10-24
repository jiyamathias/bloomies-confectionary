import { PRODUCTS } from '@/lib/products';
import { ADDON_PRICES, ICING_SURCHARGE } from '@/types';
import type { Product, CakeOptions, CakeCustomField } from '@/types';

// Shared by the cake form (what the customer sees) and the checkout API (what they're charged),
// so the two can never disagree.

export const DELUXE_FLAVOURS = ['Carrot', 'Coconut', 'Ginger Full Cream', 'Cookies & Cream'];
export const MAX_CANDLES = 50;

export const isCake = (p: Pick<Product, 'category'>) =>
  p.category === 'one-layer' || p.category === 'bigger-cakes';

export const formatNaira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

function enabled(product: Product, field: CakeCustomField) {
  const opts = product.customizationOptions;
  return !opts || opts.includes(field);
}

export interface CakePriceBreakdown {
  base: number;
  icingSurcharge: number;
  card: number;
  chamdor: number;
  candles: number;
  total: number;
}

export function cakePrice(product: Product, o: CakeOptions): CakePriceBreakdown {
  const sizeObj = product.cakeSizes?.find(s => s.label === o.size);
  const fallback = product.category === 'one-layer' ? 8500 : 22000;
  const base = sizeObj?.price ?? product.basePrice ?? fallback;

  const icingSurcharge =
    product.category === 'one-layer' && enabled(product, 'icing') && o.icing === 'whipped-cream'
      ? ICING_SURCHARGE['whipped-cream'] : 0;
  const card    = enabled(product, 'addon_card')    && o.card    ? ADDON_PRICES.card    : 0;
  const chamdor = enabled(product, 'addon_chamdor') && o.chamdor ? ADDON_PRICES.chamdor : 0;
  const candleCount = enabled(product, 'addon_candles')
    ? Math.min(Math.max(Math.floor(o.candles ?? 0), 0), MAX_CANDLES) : 0;
  const candles = candleCount * ADDON_PRICES.candlePerUnit;

  return { base, icingSurcharge, card, chamdor, candles, total: base + icingSurcharge + card + chamdor + candles };
}

/** Why an item can't be paid for online, or null if it can. */
export function quoteReason(product: Product | undefined, o: CakeOptions = {}): string | null {
  if (!product) return 'This item needs a quote.';
  if (!product.in_stock) return `${product.name} is out of stock.`;
  if (isCake(product)) {
    if (product.cakeSizes?.length && !product.cakeSizes.some(s => s.label === o.size)) return 'Please choose a cake size.';
    if (o.flavours?.some(f => DELUXE_FLAVOURS.includes(f))) return 'Deluxe flavours are priced on WhatsApp.';
    return null;
  }
  return product.unitPrice ? null : `${product.name} is priced on request.`;
}

/** Price for one unit in naira, or null if it has to be quoted on WhatsApp. */
export function onlineUnitPrice(productId: string | undefined, o: CakeOptions = {}): number | null {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || quoteReason(product, o)) return null;
  return isCake(product) ? cakePrice(product, o).total : product.unitPrice!;
}
