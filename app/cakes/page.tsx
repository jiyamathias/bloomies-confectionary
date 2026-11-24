'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import SectionHeading from '@/components/SectionHeading';
import SameDayTag from '@/components/SameDayTag';
import { useContact, useSection, waLink } from '@/lib/content/store';

export default function CakesPage() {
  const { toasts, show } = useToast();
  const head = useSection('cakes', 'header');
  const steps = useSection('cakes', 'steps');
  const oneLayerText = useSection('cakes', 'oneLayer');
  const celebration = useSection('cakes', 'celebration');
  const cta = useSection('cakes', 'cta');
  const contact = useContact();
  const oneLayer    = PRODUCTS.filter(p => p.category === 'one-layer');
  const biggerCakes = PRODUCTS.filter(p => p.category === 'bigger-cakes');

  return (
    <>
      <PageHeader cms="cakes.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      {/* How it works */}
      {steps.visible && (
      <div data-cms="cakes.steps" className="bg-[#F3F0FA] border-b border-[rgba(165,140,244,0.12)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          {[steps.step1, steps.step2, steps.step3, steps.step4].map((step, i) => (
            <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="w-7 h-7 rounded-full bg-[#433075] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-[0.85rem] text-[#433075] font-medium">{step}</span>
              {i < 3 && <span className="hidden sm:block text-[#A58CF4] text-lg">›</span>}
            </div>
          ))}
          </div>
        </div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-16">

        {/* ── ONE LAYER CAKES ── */}
        <section data-cms="cakes.oneLayer">
          <SectionHeading className="mb-8"
            title={oneLayerText.title}
            subtitle={oneLayerText.subtitle}
            aside={oneLayerText.tag ? <SameDayTag small>{oneLayerText.tag}</SameDayTag> : undefined}/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {oneLayer.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>

        {/* ── CUSTOM DESIGN CAKES ── */}
        <section data-cms="cakes.celebration">
          <SectionHeading className="mb-8" title={celebration.title} subtitle={celebration.subtitle}/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {biggerCakes.map(p => <ProductCard key={p.id} product={p} onToast={show} />)}
          </div>
        </section>
      </div>

      {/* Custom order CTA */}
      {cta.visible && (
      <div data-cms="cakes.cta" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-14">
        <div className="bg-[#433075] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-luckiest tracking-[0.02em] text-[1.8rem] text-white leading-tight mb-2">
              {cta.title}
            </h3>
            <p className="text-white/80 text-[0.92rem]">{cta.body}</p>
          </div>
          <WhatsAppBtn
            href={waLink(contact.whatsapp, cta.message)}
            className="px-8 py-4 text-[0.88rem] shrink-0">
            {cta.button}
          </WhatsAppBtn>
        </div>
      </div>
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
