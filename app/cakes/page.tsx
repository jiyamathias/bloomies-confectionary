'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import SectionHeading from '@/components/SectionHeading';
import SameDayTag from '@/components/SameDayTag';

export default function CakesPage() {
  const { toasts, show } = useToast();
  const oneLayer    = PRODUCTS.filter(p => p.category === 'one-layer');
  const biggerCakes = PRODUCTS.filter(p => p.category === 'bigger-cakes');

  return (
    <>
      <PageHeader
        title="Our" titleEm="Cakes"
        subtitle="Pick a cake, then choose the flavour, icing, colour and message. You'll see the price as you go."
        tag={<SameDayTag>Same-day on one-layer cakes</SameDayTag>}
      />

      {/* How it works */}
      <div className="bg-[#F3F0FA] border-b border-[rgba(165,140,244,0.12)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          {['1. Pick your cake', '2. Customise it', '3. Add extras', '4. Place your order'].map((step, i) => (
            <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="w-7 h-7 rounded-full bg-[#433075] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-[0.85rem] text-[#433075] font-medium">{step.slice(3)}</span>
              {i < 3 && <span className="hidden sm:block text-[#A58CF4] text-lg">›</span>}
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-16">

        {/* ── ONE LAYER CAKES ── */}
        <section>
          <SectionHeading className="mb-8"
            title="One-layer cakes"
            subtitle="Order before 12 PM and we can deliver today."
            aside={<SameDayTag small>Same day</SameDayTag>}/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {oneLayer.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>

        {/* ── CUSTOM DESIGN CAKES ── */}
        <section>
          <SectionHeading className="mb-8"
            title="Celebration cakes"
            subtitle="Multi-layer cakes from 6″ to 12″. Choose the size, layers, flavours, colours and topper. These need a few days' notice."/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {biggerCakes.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>
      </div>

      {/* Custom order CTA */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-14">
        <div className="bg-[#433075] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-luckiest tracking-[0.02em] text-[1.8rem] text-white leading-tight mb-2">
              Don&apos;t see your design?
            </h3>
            <p className="text-white/80 text-[0.92rem]">
              Send us a reference photo on WhatsApp and we&apos;ll quote you for it.
            </p>
          </div>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20a%20fully%20custom%20cake!"
            className="px-8 py-4 text-[0.88rem] shrink-0">
            Chat with Us
          </WhatsAppBtn>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
