'use client';
import { useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { GALLERY } from '@/lib/products';

const FILTERS = ['All', 'One Layer', 'Bigger Cake', 'Custom Cake'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? GALLERY : GALLERY.filter(g => g.category === active);

  return (
    <>
      <PageHeader
        title="Our" titleEm="Gallery"
        subtitle="Cakes we've made for birthdays, weddings and everything in between. See one you like? Tap it to ask for the same."
      />

      {/* Filter tabs */}
      <div className="border-b border-[rgba(165,140,244,0.15)] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex gap-0">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-5 py-4 text-[0.82rem] tracking-[0.04em] whitespace-nowrap
                border-b-2 transition-all duration-200
                ${active === f
                  ? 'border-[#433075] text-[#433075] font-medium'
                  : 'border-transparent text-[#6E6A8C] hover:text-[#433075]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {filtered.map((item, i) => (
            <a
              key={item.id}
              href={`https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20order%20a%20${encodeURIComponent(item.title)}%20cake!`}
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
                    Order one like this
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
        <div className="mt-16 bg-[#E2BBFA] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-luckiest tracking-[0.02em] text-[clamp(1.7rem,4vw,2.5rem)] text-[#433075] leading-tight mb-3">
            Bake too? Visit BakersMerch
          </h2>
          <p className="text-[0.95rem] text-[#433075]/85 mb-7 max-w-md mx-auto">
            Baking tools, cake boxes, stands and accessories for home and professional bakers.
          </p>
          <a
            href="https://bakersmerch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#433075] text-white px-10 py-4
              rounded-full text-[0.88rem] font-semibold hover:bg-[#5B3E8A]
              transition-colors duration-200 active:scale-[0.97]">
            Go to BakersMerch ↗
          </a>
        </div>
      </div>
    </>
  );
}
