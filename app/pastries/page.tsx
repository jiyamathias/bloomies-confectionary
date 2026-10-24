'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import SameDayTag from '@/components/SameDayTag';

export default function PastriesPage() {
  const { toasts, show } = useToast();
  const products = PRODUCTS.filter(p => p.category === 'pastries');

  return (
    <>
      <PageHeader
        title="Pastries"
        subtitle="Meat pies, sausage rolls, cinnamon rolls and more, baked every morning. Popular ones sell out early."
        tag={<SameDayTag>Some items same day</SameDayTag>}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onToast={show} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-14">
        <div className="bg-[#433075] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-luckiest tracking-[0.02em] text-[1.8rem] text-white leading-tight mb-2">
              Ordering for a crowd?
            </h3>
            <p className="text-white/80 text-[0.92rem]">
              Parties, offices, church events: tell us how many people and when, and we&apos;ll put together a bulk order.
            </p>
          </div>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20a%20bulk%20pastry%20order!"
            className="px-8 py-4 text-[0.88rem] shrink-0">
            Ask about bulk orders
          </WhatsAppBtn>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
