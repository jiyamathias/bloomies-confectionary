'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/products';
import { Gift, Coffee, UtensilsCrossed, Package } from 'lucide-react';
import { useContact, useSection, waLink } from '@/lib/content/store';

// Icons follow the order of the "What we offer" list in the CMS.
const OPTION_ICONS = [Gift, Coffee, UtensilsCrossed, Package];

export default function EventsPage() {
  const products = PRODUCTS.filter(p => p.category === 'events');
  const head = useSection('events', 'header');
  const panel = useSection('events', 'panel');
  const contact = useContact();

  return (
    <>
      <PageHeader cms="events.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10">

        {/* Hero card */}
        <div data-cms="events.panel" className="bg-[#433075] rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="font-luckiest tracking-[0.02em] text-[clamp(1.8rem,3.5vw,2.6rem)] text-white leading-[1.08] mb-4">
                {panel.title}
              </h2>
              <p className="text-white/80 text-[0.95rem] leading-relaxed mb-7">{panel.body}</p>
              <a
                href={waLink(contact.whatsapp, panel.message)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                  px-7 py-3.5 rounded-full text-[0.85rem] font-semibold self-start
                  hover:bg-[#E2BBFA] transition-colors duration-200">
                {panel.button}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 pt-0 lg:pt-6 self-center">
              {panel.options.map((opt, i) => {
                const Icon = OPTION_ICONS[i % OPTION_ICONS.length];
                return (
                <div key={i}
                  className="bg-white/[0.08] border border-white/[0.14] rounded-xl p-4
                    flex items-center gap-3">
                  <Icon size={20} className="text-[#E2BBFA] shrink-0"/>
                  <span className="text-white/90 text-[0.85rem]">{opt.text}</span>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
