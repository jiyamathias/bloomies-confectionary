'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import CakeOrderForm from '@/components/CakeOrderForm';
import type { Product } from '@/types';

const BADGE: Record<string, string> = {
  rose:  'bg-[#E8609A] text-white',
  green: 'bg-[#4A9A4A] text-white',
  mauve: 'bg-[#9B7EC8] text-white',
};

const isCake = (c: string) => c === 'one-layer' || c === 'bigger-cakes';

export default function ProductCard({ product, onToast }: {
  product: Product;
  onToast?: (msg: string) => void;
}) {
  const { add } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  function handleClick() {
    if (isCake(product.category)) {
      setModalOpen(true);
    } else {
      // non-cake: just add to cart directly
      add({ id: product.id, name: product.name, price: product.price, image: product.image });
      onToast?.(`${product.name} added to cart`);
    }
  }

  const isWA = product.price === 'Via WhatsApp' || product.price === 'Custom Pricing';

  return (
    <>
      <div
        onClick={product.in_stock ? handleClick : undefined}
        className={`bg-white rounded-2xl overflow-hidden border border-[rgba(232,96,154,0.15)]
          transition-all duration-300 flex flex-col group
          ${product.in_stock
            ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(91,45,142,0.10)] hover:border-[#E8DAFF]'
            : 'opacity-75'}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingBottom: '68%' }}>
          <Image src={product.image} alt={product.name} fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          {product.badge && (
            <span className={`absolute top-2.5 left-2.5 text-[0.6rem] tracking-[0.08em] font-bold
              px-2.5 py-1 rounded-full uppercase ${BADGE[product.badge_color || 'rose']}`}>
              {product.badge}
            </span>
          )}
          {!product.in_stock && (
            <span className="absolute top-2.5 right-2.5 bg-black/60 text-white
              text-[0.6rem] tracking-[0.08em] font-bold px-2.5 py-1 rounded-full uppercase">
              Out of Stock
            </span>
          )}
          {/* Cake "customise" hint */}
          {isCake(product.category) && product.in_stock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
              flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-white text-[#5B2D8E] text-[0.78rem] font-semibold px-4 py-2 rounded-full shadow-lg">
                Customise & Order →
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-cormorant text-[1.15rem] font-semibold text-[#5B2D8E] mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-[0.75rem] text-[#7B5EA7] leading-relaxed mb-2 flex-1">{product.description}</p>
          {product.moq && <p className="text-[0.7rem] text-[#9B7EC8] italic mb-2">{product.moq}</p>}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-[rgba(232,96,154,0.1)]">
            <span className="text-[0.9rem] font-semibold text-[#E8609A]">{product.price}</span>
            {isCake(product.category) && product.in_stock && (
              <span className="text-[0.72rem] text-[#5B2D8E] font-medium bg-[#F0EBFF] px-3 py-1.5 rounded-full">
                Customise →
              </span>
            )}
            {!isCake(product.category) && !isWA && product.in_stock && (
              <button
                onClick={e => { e.stopPropagation(); handleClick(); }}
                className="text-[0.72rem] bg-[#5B2D8E] text-white px-3.5 py-2 rounded-full
                  font-medium hover:bg-[#E8609A] transition-all duration-200"
              >
                + Add
              </button>
            )}
            {isWA && (
              <a href={`https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(product.name)}!`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-[0.72rem] bg-[#25D366] text-white px-3.5 py-2 rounded-full
                  font-medium hover:bg-[#1BBE5C] transition-all duration-200">
                Order →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Full-screen customise modal for cakes ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAFAFE] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl
            max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">

            {/* Modal header */}
            <div className="sticky top-0 bg-[#FAFAFE] z-10 px-5 pt-5 pb-4 border-b border-[rgba(232,96,154,0.15)]">
              <div className="flex gap-4 items-center">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-cormorant text-[1.4rem] font-semibold text-[#5B2D8E] leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-[0.78rem] text-[#E8609A] font-medium">{product.price}</p>
                </div>
                <button onClick={() => setModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white border border-[rgba(232,96,154,0.2)]
                    flex items-center justify-center text-[#7B5EA7] hover:text-[#5B2D8E]
                    hover:border-[#E8609A] transition-all shrink-0">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="px-5 py-5 flex-1">
              <CakeOrderForm product={product} onClose={() => setModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
