'use client';
import { useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { GALLERY } from '@/lib/products';
import { useContact, useSection, waLink } from '@/lib/content/store';

const FILTERS = ['All', 'One Layer', 'Bigger Cake', 'Custom Cake'];

export default function GalleryPage() {
  const head = useSection('gallery', 'header');
  const cards = useSection('gallery', 'cards');
  const merch = useSection('gallery', 'merch');
  const contact = useContact();
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? GALLERY : GALLERY.filter(g => g.category === active);

  return (
    <>
      <PageHeader cms="gallery.header" title={head.title} subtitle={head.subtitle} badge={head.tag}
      />

      {/* Filter pills (wrap on small screens instead of scrolling off) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        <div role="radiogroup" aria-label="Filter cakes" className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} role="radio" aria-checked={active === f} onClick={() => setActive(f)}
              className={`px-4 py-2.5 rounded-full text-[0.85rem] font-medium border transition-colors
                ${active === f
                  ? 'bg-[#433075] border-[#433075] text-white'
                  : 'bg-white border-[rgba(67,48,117,0.2)] text-[#433075] hover:bg-[#F3F0FA]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-6 pb-8 sm:pb-10 lg:pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {filtered.map((item, i) => (
            <a
              key={item.id}
              href={waLink(contact.whatsapp, `Hi Bloomies, I'd like to order a ${item.title} cake!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border border-[rgba(165,140,244,0.15)]
                bg-white transition-shadow duration-200
                hover:shadow-[0_14px_34px_rgba(67,48,117,0.14)]"
              style={{ animationDelay: `${i * 40}ms` }}>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ paddingBottom: '110%' }}>
                <Image
                  src={item.image} alt={item.title} fill
                  sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[rgba(67,48,117,0)] group-hover:bg-[rgba(67,48,117,0.55)]
                  transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    bg-white text-[#433075] text-[0.78rem] font-semibold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                    {cards.hoverLabel}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="text-[0.92rem] font-semibold text-[#433075] leading-tight mb-0.5">
                  {item.title}
                </p>
                <p className="text-[0.75rem] text-[#5E5A7C]">{item.category}</p>
              </div>
            </a>
          ))}
        </div>

        {/* BakersMerch CTA */}
        {merch.visible && (
        <div data-cms="gallery.merch" className="mt-16 bg-[#E2BBFA] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-luckiest tracking-[0.02em] text-[clamp(1.7rem,4vw,2.5rem)] text-[#433075] leading-tight mb-3">
            {merch.title}
          </h2>
          <p className="text-[0.95rem] text-[#433075]/85 mb-7 max-w-md mx-auto">{merch.body}</p>
          <a
            href={merch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#433075] text-white px-10 py-4
              rounded-full text-[0.88rem] font-semibold hover:bg-[#5B3E8A]
              transition-colors duration-200 active:scale-[0.97]">
            {merch.button}
          </a>
        </div>
        )}
      </div>
    </>
  );
}
