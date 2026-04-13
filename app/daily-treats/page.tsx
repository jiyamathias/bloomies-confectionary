'use client';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { ToastContainer, useToast } from '@/components/Toast';
import { useCart } from '@/lib/cart';
import { PRODUCTS } from '@/lib/products';
import { Zap } from 'lucide-react';

export default function DailyTreatsPage() {
  const treats = PRODUCTS.filter(p => p.category === 'daily-treats');
  const { add } = useCart();
  const { toasts, show } = useToast();

  function handleAdd(p: typeof treats[0]) {
    add({ id: p.id, name: p.name, price: p.price, image: p.image });
    show(`${p.name} added to cart`);
  }

  return (
    <>
      <PageHeader
        title="Daily"
        titleEm="Treats"
        subtitle="Made fresh every day. Grab-and-go favourites to brighten your mornings and everything in between."
        tag={
          <span className="inline-flex items-center gap-1.5 bg-[rgba(92,184,92,0.1)]
            border border-[rgba(92,184,92,0.3)] text-[#3A7A3A] px-4 py-2 rounded-full
            text-[0.72rem] font-medium">
            <Zap size={12} /> All items available same day
          </span>
        }
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Mobile: 2-col grid | Desktop: 6-col */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {treats.map(p => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[rgba(232,96,154,0.15)]
                transition-all duration-300 hover:-translate-y-1.5
                hover:shadow-[0_14px_32px_rgba(232,96,154,0.15)]
                hover:border-[#E8DAFF] flex flex-col"
            >
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '80%' }}>
                <Image
                  src={p.image} alt={p.name} fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
              </div>
              <div className="p-3 flex flex-col flex-1 text-center">
                <p className="text-[0.82rem] font-medium text-[#5B2D8E] mb-0.5">{p.name}</p>
                <p className="text-[0.75rem] text-[#E8609A] mb-3">{p.price}</p>
                <button
                  onClick={() => handleAdd(p)}
                  className="mt-auto w-full bg-[#5B2D8E] text-white text-[0.72rem] font-semibold
                    py-2 rounded-full transition-all duration-200
                    hover:bg-[#E8609A] active:scale-[0.97]"
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-[0.8rem] text-[#7B5EA7] mt-8">
          Tap any item to add to your cart, then checkout via WhatsApp 🛒
        </p>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
