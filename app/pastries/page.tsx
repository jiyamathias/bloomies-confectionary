'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import { Zap } from 'lucide-react';

export default function PastriesPage() {
  const { toasts, show } = useToast();
  const products = PRODUCTS.filter(p => p.category === 'pastries');

  return (
    <>
      <PageHeader
        title="Fresh"
        titleEm="Pastries"
        subtitle="Baked fresh every morning. Golden, flaky, and full of flavour — our pastries sell out fast."
        tag={
          <span className="inline-flex items-center gap-1.5 bg-[rgba(92,184,92,0.1)]
            border border-[rgba(92,184,92,0.3)] text-[#3A7A3A] px-4 py-2 rounded-full
            text-[0.72rem] font-medium">
            <Zap size={12} /> Select items available same day
          </span>
        }
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
            <h3 className="font-cormorant text-[1.8rem] text-white font-normal mb-1">
              Need a <em className="italic text-[#E1D7F0]">bulk pastry order?</em>
            </h3>
            <p className="text-white/50 text-[0.88rem]">
              Planning an event or office treat? We handle large orders with the same love and quality.
            </p>
          </div>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20a%20bulk%20pastry%20order!"
            className="px-8 py-4 text-[0.88rem] shrink-0">
            Enquire via WhatsApp
          </WhatsAppBtn>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
