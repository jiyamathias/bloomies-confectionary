'use client';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { PRODUCTS } from '@/lib/products';

export default function SmallChopsPage() {
  const packages = PRODUCTS.filter(p => p.category === 'small-chops');

  return (
    <>
      <PageHeader
        title="Small Chops"
        titleEm="Packages"
        subtitle="From intimate house parties to grand celebrations — our packages are crowd-pleasers every single time."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

        {/* Package cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className="group relative rounded-2xl overflow-hidden cursor-pointer
              border border-[rgba(232,96,154,0.12)] transition-transform duration-350
              hover:scale-[1.025]">
              <div className="relative h-72 sm:h-80">
                <Image
                  src={pkg.image} alt={pkg.name} fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(91,45,142,0.92)] via-[rgba(91,45,142,0.3)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="font-cormorant text-[1.7rem] text-white font-semibold block mb-1">
                  {pkg.name}
                </span>
                <p className="text-white/65 text-[0.78rem] mb-2">{pkg.description}</p>
                <p className="text-[#E8DAFF] font-semibold text-[0.9rem] mb-3">{pkg.price}</p>
                <a
                  href={`https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20order%20the%20${encodeURIComponent(pkg.name)}!`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[0.78rem] font-semibold
                    bg-white text-[#5B2D8E] rounded-full transition-all duration-300
                    hover:bg-[#E8609A] hover:text-white active:scale-[0.97]">
                  Order via WhatsApp →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom combo section */}
        <div className="bg-[#F0EBFF] rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="font-cormorant text-[1.8rem] text-[#5B2D8E] mb-2">Need a custom combo?</h3>
          <p className="text-[0.88rem] text-[#7B5EA7] mb-6 max-w-md mx-auto">
            Tell us your guest count and preferences — we&apos;ll put together the perfect package just for you.
          </p>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%20need%20a%20custom%20small%20chops%20package!"
            className="px-8 py-4 text-[0.88rem] inline-flex">
            Chat with Us
          </WhatsAppBtn>
        </div>
      </div>
    </>
  );
}
