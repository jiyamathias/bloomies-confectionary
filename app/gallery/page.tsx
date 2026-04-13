'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { GALLERY } from '@/lib/products';
import { ShoppingBag } from 'lucide-react';

const FILTERS = ['All', 'One Layer', 'Bigger Cake', 'Custom Cake'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? GALLERY : GALLERY.filter(g => g.category === active);

  return (
    <>
      <PageHeader
        title="Our" titleEm="Gallery"
        subtitle="A peek into the sweetness we create. Every cake is handcrafted with love — click any piece to order yours."
      />

      {/* Filter tabs */}
      <div className="border-b border-[rgba(232,96,154,0.15)] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-0">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-5 py-4 text-[0.82rem] tracking-[0.04em] whitespace-nowrap
                border-b-2 transition-all duration-200
                ${active === f
                  ? 'border-[#E8609A] text-[#5B2D8E] font-medium'
                  : 'border-transparent text-[#7B5EA7] hover:text-[#5B2D8E]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {filtered.map((item, i) => (
            <div key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-[rgba(232,96,154,0.15)]
                bg-white transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(232,96,154,0.18)]"
              style={{ animationDelay: `${i * 40}ms` }}>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ paddingBottom: '110%' }}>
                <Image
                  src={item.image} alt={item.title} fill
                  sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[rgba(232,96,154,0)] group-hover:bg-[rgba(232,96,154,0.15)]
                  transition-all duration-300" />
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="font-cormorant text-[1.05rem] font-semibold text-[#5B2D8E] leading-tight mb-0.5">
                  {item.title}
                </p>
                <p className="text-[0.7rem] text-[#7B5EA7] mb-3">{item.category}</p>

                {/* Order button */}
                <Link
                  href="/cakes"
                  className="w-full flex items-center justify-center gap-2
                    bg-[#5B2D8E] text-white py-2.5 rounded-full text-[0.75rem] font-semibold
                    hover:bg-[#E8609A] transition-all duration-250 active:scale-[0.97]">
                  <ShoppingBag size={13} /> Order This Style
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BakersMerch CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#F0EBFF] to-[#F0E8F5]
          rounded-2xl p-8 sm:p-12 text-center border border-[rgba(232,96,154,0.15)]">
          <p className="text-[0.72rem] tracking-[0.18em] uppercase text-[#E8609A] mb-3">✦ BakersMerch</p>
          <h2 className="font-cormorant text-[clamp(1.8rem,4vw,2.8rem)] text-[#5B2D8E] font-normal mb-3">
            Love baking too? Shop <em className="italic text-[#E8609A]">BakersMerch</em>
          </h2>
          <p className="text-[0.88rem] text-[#7B5EA7] mb-7 max-w-md mx-auto">
            Premium baking tools, boxes, stands and accessories for bakers who mean business.
          </p>
          <a
            href="https://bakersmerch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5B2D8E] text-white px-10 py-4
              rounded-full text-[0.88rem] font-semibold hover:bg-[#E8609A]
              transition-all duration-300 hover:-translate-y-0.5
              hover:shadow-[0_12px_30px_rgba(232,96,154,0.3)] active:scale-[0.97]">
            Visit BakersMerch →
          </a>
        </div>
      </div>
    </>
  );
}
