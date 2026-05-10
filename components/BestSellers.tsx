'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS, DEFAULT_BEST_SELLERS, getBestSellersConfig } from '@/lib/products';
import type { BestSellersConfig } from '@/lib/products';
import type { Product } from '@/types';

const INITIAL_SHOW = 4; // show 4 first, up to 6 total

export default function BestSellers() {
  const [config,   setConfig]   = useState<BestSellersConfig>(DEFAULT_BEST_SELLERS);
  const [showAll,  setShowAll]  = useState(false);
  const { toasts, show } = useToast();

  // Load from localStorage on mount (picks up admin edits)
  useEffect(() => {
    setConfig(getBestSellersConfig());
    // Listen for storage changes from admin panel in same tab
    const handler = () => setConfig(getBestSellersConfig());
    window.addEventListener('bloomies:bestsellers', handler);
    return () => window.removeEventListener('bloomies:bestsellers', handler);
  }, []);

  // Map IDs to actual products, preserve order, skip not-found
  const products: Product[] = config.productIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const visible  = showAll ? products : products.slice(0, INITIAL_SHOW);
  const hasMore  = products.length > INITIAL_SHOW;

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-14 lg:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em]
            uppercase text-[#A58CF4] mb-3">
            <span className="w-7 h-px bg-[#A58CF4]" /> Our Favourites
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-normal text-[#433075]">
            {config.title}
          </h2>
          <p className="text-[0.88rem] text-[#6E6A8C] mt-1.5">
            Our customers&apos; most-loved picks — made fresh, every day.
          </p>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {visible.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
          >
            <ProductCard product={product} onToast={show} />
          </div>
        ))}
      </div>

      {/* Load more / Show less */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(v => !v)}
            className="inline-flex items-center gap-2 border-2 border-[#A58CF4] text-[#A58CF4]
              px-8 py-3 rounded-full text-[0.85rem] font-semibold
              hover:bg-[#A58CF4] hover:text-white transition-all duration-250
              active:scale-[0.97]"
          >
            {showAll ? (
              <>Show Less ↑</>
            ) : (
              <>Load More <span className="opacity-60 font-normal text-[0.78rem]">
                ({products.length - INITIAL_SHOW} more)
              </span></>
            )}
          </button>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </section>
  );
}
