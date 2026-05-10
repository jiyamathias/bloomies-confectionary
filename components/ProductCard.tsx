'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart';
import CakeOrderForm from '@/components/CakeOrderForm';
import type { Product } from '@/types';

const BADGE_STYLES: Record<string, string> = {
  rose:  'bg-[#433075] text-white',
  green: 'bg-emerald-600 text-white',
  mauve: 'bg-[#A58CF4] text-white',
};

const isCake = (c: string) => c === 'one-layer' || c === 'bigger-cakes';

export default function ProductCard({ product, onToast }: {
  product: Product;
  onToast?: (msg: string) => void;
}) {
  const { add } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  function handleClick() {
    if (!product.in_stock) return;
    if (isCake(product.category)) {
      setModalOpen(true);
    } else {
      add({ id: product.id, name: product.name, price: product.price, image: product.image });
      onToast?.(`${product.name} added to cart ✓`);
    }
  }

  const isWA = product.price === 'Via WhatsApp' || product.price === 'Custom Pricing';

  return (
    <>
      <div
        onClick={product.in_stock ? handleClick : undefined}
        className={`group relative bg-white rounded-2xl overflow-hidden flex flex-col
          border border-[rgba(165,140,244,0.12)]
          transition-all duration-350
          ${product.in_stock
            ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(67,48,117,0.13)] hover:border-[rgba(165,140,244,0.3)]'
            : 'opacity-65 select-none'}`}>

        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ paddingBottom: '70%' }}>
          <Image src={product.image} alt={product.name} fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"/>

          {/* Hover shimmer overlay on cakes */}
          {isCake(product.category) && product.in_stock && (
            <div className="absolute inset-0 bg-[#433075]/0 group-hover:bg-[#433075]/40
              transition-all duration-350 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300
                translate-y-2 group-hover:translate-y-0
                bg-white text-[#433075] text-[0.78rem] font-semibold px-5 py-2.5
                rounded-full shadow-xl flex items-center gap-2">
                <Sparkles size={13}/> Customise & Order
              </div>
            </div>
          )}

          {/* Non-cake add hint */}
          {!isCake(product.category) && product.in_stock && !isWA && (
            <div className="absolute inset-0 bg-[#433075]/0 group-hover:bg-[#433075]/35
              transition-all duration-350 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300
                translate-y-2 group-hover:translate-y-0
                bg-white text-[#433075] text-[0.78rem] font-semibold px-5 py-2.5
                rounded-full shadow-xl flex items-center gap-2">
                <ShoppingBag size={13}/> Add to Cart
              </div>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 text-[0.6rem] tracking-[0.08em]
              font-bold px-2.5 py-1 rounded-full uppercase shadow-sm
              ${BADGE_STYLES[product.badge_color || 'rose']}`}>
              {product.badge}
            </span>
          )}

          {/* Out of stock */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-black/70 text-white text-[0.72rem] font-semibold
                px-4 py-2 rounded-full tracking-[0.06em]">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-cormorant text-[1.15rem] font-semibold text-[#433075]
            mb-1 leading-tight group-hover:text-[#5B3E8A] transition-colors">
            {product.name}
          </h3>
          <p className="text-[0.75rem] text-[#6E6A8C] leading-relaxed mb-2 flex-1 line-clamp-2">
            {product.description}
          </p>
          {product.moq && (
            <p className="text-[0.67rem] text-[#A58CF4] italic mb-2">{product.moq}</p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3
            border-t border-[rgba(165,140,244,0.1)]">
            <span className="font-cormorant text-[1rem] font-semibold text-[#433075]">
              {product.price}
            </span>

            {isCake(product.category) && product.in_stock && (
              <span className="text-[0.7rem] text-[#433075] bg-[#F3F0FA]
                px-3 py-1.5 rounded-full font-medium border border-[rgba(165,140,244,0.2)]">
                Customise →
              </span>
            )}
            {!isCake(product.category) && !isWA && product.in_stock && (
              <button
                onClick={e => { e.stopPropagation(); handleClick(); }}
                className="text-[0.72rem] bg-[#433075] text-white px-3.5 py-2 rounded-full
                  font-medium hover:bg-[#A58CF4] transition-all duration-200 active:scale-[0.96]">
                + Add
              </button>
            )}
            {isWA && (
              <a href={`https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(product.name)}!`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-[0.72rem] bg-[#25D366] text-white px-3.5 py-2 rounded-full
                  font-medium hover:bg-[#1EB85A] transition-all duration-200">
                Order →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Cake customisation modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(67,48,117,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#FAFAFA] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl
            max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">

            {/* Header */}
            <div className="sticky top-0 bg-[#FAFAFA] z-10 px-5 pt-5 pb-4
              border-b border-[rgba(165,140,244,0.12)]">
              <div className="flex gap-4 items-center">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0
                  shadow-md border border-[rgba(165,140,244,0.15)]">
                  <Image src={product.image} alt={product.name} fill
                    className="object-cover" sizes="56px"/>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-cormorant text-[1.4rem] font-semibold text-[#433075] leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-[0.78rem] text-[#A58CF4] font-medium">{product.price}</p>
                </div>
                <button onClick={() => setModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white border border-[rgba(165,140,244,0.25)]
                    flex items-center justify-center text-[#6E6A8C]
                    hover:border-[#433075] hover:text-[#433075] transition-all shrink-0">
                  <X size={16}/>
                </button>
              </div>
            </div>

            <div className="px-5 py-5 flex-1">
              <CakeOrderForm product={product} onClose={() => setModalOpen(false)}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
