import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { PRODUCTS } from '@/lib/products';

const EVENT_OPTIONS = [
  { icon: '🎁', text: 'Premium Treat Boxes' },
  { icon: '🍳', text: 'Office Breakfast Boxes' },
  { icon: '🥂', text: 'Small Chops Event Catering' },
  { icon: '📦', text: 'Bulk Custom Packages' },
];

export default function EventsPage() {
  const products = PRODUCTS.filter(p => p.category === 'events');

  return (
    <>
      <PageHeader
        title="Corporate"
        titleEm="& Events"
        subtitle="Elevate every occasion with premium treat experiences that leave lasting impressions."
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10">

        {/* Hero card */}
        <div className="bg-[#433075] rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] text-white font-normal leading-[1.15] mb-4">
                The Perfect Touch for{' '}
                <em className="italic text-[#E1D7F0]">Every Celebration</em>
              </h2>
              <p className="text-white/50 text-[0.88rem] leading-relaxed mb-7">
                Whether it&apos;s a board meeting, birthday bash, or client appreciation — Bloomies delivers
                experiences your guests will remember long after the last bite.
              </p>
              <a
                href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20discuss%20an%20event%20catering%20order!"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                  px-7 py-3.5 rounded-full text-[0.85rem] font-semibold self-start
                  hover:bg-[#E1D7F0] hover:-translate-y-0.5 transition-all duration-250">
                💬 Discuss Your Event
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-6 self-center">
              {EVENT_OPTIONS.map(opt => (
                <div key={opt.text}
                  className="bg-white/[0.07] border border-white/[0.1] rounded-xl p-4
                    flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-white/80 text-[0.82rem]">{opt.text}</span>
                </div>
              ))}
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
