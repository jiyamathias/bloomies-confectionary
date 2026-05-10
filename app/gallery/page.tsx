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
        subtitle="A peek into the sweetness we create. Every cake is handcrafted with love — click any piece to order yours on WhatsApp."
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
                bg-white transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(67,48,117,0.15)]"
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
                    💬 Order on WhatsApp
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="font-cormorant text-[1.05rem] font-semibold text-[#433075] leading-tight mb-0.5">
                  {item.title}
                </p>
                <p className="text-[0.7rem] text-[#6E6A8C]">{item.category}</p>
              </div>
            </a>
          ))}
        </div>

        {/* BakersMerch CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#F3F0FA] to-[#E1D7F0]
          rounded-2xl p-8 sm:p-12 text-center border border-[rgba(165,140,244,0.2)]">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">✦ BakersMerch</p>
          <h2 className="font-cormorant text-[clamp(1.8rem,4vw,2.8rem)] text-[#433075] font-normal mb-3">
            Love baking too? Shop <em className="italic text-[#A58CF4]">BakersMerch</em>
          </h2>
          <p className="text-[0.88rem] text-[#6E6A8C] mb-7 max-w-md mx-auto">
            Premium baking tools, boxes, stands and accessories for bakers who mean business.
          </p>
          <a
            href="https://bakersmerch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#433075] text-white px-10 py-4
              rounded-full text-[0.88rem] font-semibold hover:bg-[#6E6A8C]
              transition-all duration-300 hover:-translate-y-0.5
              hover:shadow-[0_12px_30px_rgba(67,48,117,0.3)] active:scale-[0.97]">
            Visit BakersMerch →
          </a>
        </div>
      </div>
    </>
  );
}
