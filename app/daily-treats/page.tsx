'use client';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { ToastContainer, useToast } from '@/components/Toast';
import { useCart } from '@/lib/cart';
import { PRODUCTS } from '@/lib/products';
import { onlineUnitPrice } from '@/lib/pricing';
import SameDayTag from '@/components/SameDayTag';

export default function DailyTreatsPage() {
  const treats = PRODUCTS.filter(p => p.category === 'daily-treats');
  const { add } = useCart();
  const { toasts, show } = useToast();

  function handleAdd(p: typeof treats[0]) {
    add({ id: p.id, name: p.name, price: p.price, image: p.image, productId: p.id, unitPrice: onlineUnitPrice(p.id) });
    show(`${p.name} added to cart`);
  }

  return (
    <>
      <PageHeader
        title="Daily"
        titleEm="Treats"
        subtitle="Cake slices, banana bread, cupcakes and other grab-and-go treats, made fresh each day."
        tag={<SameDayTag>All items same day</SameDayTag>}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
        {/* Mobile: 2-col grid | Desktop: 6-col */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {treats.map(p => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[rgba(165,140,244,0.15)]
                transition-shadow duration-200 hover:shadow-[0_12px_28px_rgba(67,48,117,0.12)]
                flex flex-col"
            >
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '80%' }}>
                <Image
                  src={p.image} alt={p.name} fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
              </div>
              <div className="p-3 flex flex-col flex-1 text-center">
                <p className="text-[0.82rem] font-medium text-[#433075] mb-0.5">{p.name}</p>
                <p className="text-[0.8rem] font-semibold text-[#5E5A7C] mb-3">{p.price}</p>
                <button
                  onClick={() => handleAdd(p)}
                  className="mt-auto w-full bg-[#433075] text-white text-[0.72rem] font-semibold
                    py-2 rounded-full transition-all duration-200
                    hover:bg-[#5B3E8A] active:scale-[0.97]"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>


      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
