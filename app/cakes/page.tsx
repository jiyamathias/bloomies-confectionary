'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import { Zap } from 'lucide-react';

export default function CakesPage() {
  const { toasts, show } = useToast();
  const oneLayer    = PRODUCTS.filter(p => p.category === 'one-layer');
  const biggerCakes = PRODUCTS.filter(p => p.category === 'bigger-cakes');

  return (
    <>
      <PageHeader
        title="Our" titleEm="Cakes"
        subtitle="Every cake is customised just for you — choose your flavour, icing, colour, add-ons and more. Click any cake to begin."
        tag={
          <span className="inline-flex items-center gap-1.5 bg-[rgba(92,184,92,0.1)]
            border border-[rgba(92,184,92,0.3)] text-[#3A7A3A] px-4 py-2 rounded-full text-[0.72rem] font-medium">
            <Zap size={12} /> Same-day delivery on 1-layer cakes
          </span>
        }
      />

      {/* How it works */}
      <div className="bg-[#F3F0FA] border-b border-[rgba(165,140,244,0.12)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          {['1. Pick your cake', '2. Customise it', '3. Add extras', '4. Order via WhatsApp'].map((step, i) => (
            <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="w-7 h-7 rounded-full bg-[#A58CF4] text-white text-[0.72rem] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-[0.82rem] text-[#6E6A8C] font-medium">{step.slice(3)}</span>
              {i < 3 && <span className="hidden sm:block text-[#A58CF4] text-lg">›</span>}
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-16">

        {/* ── ONE LAYER CAKES ── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 pb-5 border-b border-[rgba(165,140,244,0.12)]">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[rgba(92,184,92,0.1)] border border-[rgba(92,184,92,0.25)] text-[#3A7A3A] px-3 py-1 rounded-full text-[0.7rem] font-medium mb-2">
                <Zap size={11} /> Same Day Available
              </div>
              <h2 className="font-cormorant text-[2rem] text-[#433075] font-normal">
                One Layer Cakes
              </h2>
              <p className="text-[0.85rem] text-[#6E6A8C] mt-1 max-w-lg">
                Order before 12 PM for same-day delivery. Click any cake to customise your flavour, icing type, colour, message and add-ons — the price updates live.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {oneLayer.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>

        {/* ── CUSTOM DESIGN CAKES ── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 pb-5 border-b border-[rgba(165,140,244,0.12)]">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[rgba(165,140,244,0.1)] border border-[rgba(165,140,244,0.25)] text-[#A58CF4] px-3 py-1 rounded-full text-[0.7rem] font-medium mb-2">
                ✨ Fully Customisable
              </div>
              <h2 className="font-cormorant text-[2rem] text-[#433075] font-normal">
                Custom Design Cakes
              </h2>
              <p className="text-[0.85rem] text-[#6E6A8C] mt-1 max-w-lg">
                Multi-layer celebration cakes in 6″–12″. Choose your size, layers, flavours, design style, colours, toppings and add-ons. Click any design to begin.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {biggerCakes.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>
      </div>

      {/* Custom order CTA */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-14">
        <div className="bg-[#433075] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#A58CF4]/10 pointer-events-none" />
          <div className="relative z-[1]">
            <h3 className="font-cormorant text-[1.8rem] text-white font-normal mb-1">
              Have something truly unique in mind?{' '}
              <em className="italic text-[#E1D7F0]">Let's bring it to life.</em>
            </h3>
            <p className="text-white/50 text-[0.88rem]">
              Send us a reference photo and we'll create your dream cake from scratch.
            </p>
          </div>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20a%20fully%20custom%20cake!"
            className="px-8 py-4 text-[0.88rem] shrink-0 relative z-[1]">
            Chat with Us
          </WhatsAppBtn>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
