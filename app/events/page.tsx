import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { PRODUCTS } from '@/lib/products';
import { Gift, Coffee, UtensilsCrossed, Package } from 'lucide-react';

const EVENT_OPTIONS = [
  { Icon: Gift,            text: 'Treat boxes for staff & clients' },
  { Icon: Coffee,          text: 'Office breakfast boxes' },
  { Icon: UtensilsCrossed, text: 'Small chops for events' },
  { Icon: Package,         text: 'Bulk & custom packages' },
];

export default function EventsPage() {
  const products = PRODUCTS.filter(p => p.category === 'events');

  return (
    <>
      <PageHeader
        title="Corporate"
        titleEm="& Events"
        subtitle="Treat boxes, breakfast boxes and small chops for offices, launches, weddings and parties."
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10">

        {/* Hero card */}
        <div className="bg-[#433075] rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="font-luckiest tracking-[0.02em] text-[clamp(1.8rem,3.5vw,2.6rem)] text-white leading-[1.08] mb-4">
                Feeding a room full of people?
              </h2>
              <p className="text-white/80 text-[0.95rem] leading-relaxed mb-7">
                Tell us the date, how many guests and your budget. We&apos;ll suggest a package and deliver
                on the day.
              </p>
              <a
                href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20discuss%20an%20event%20catering%20order!"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                  px-7 py-3.5 rounded-full text-[0.85rem] font-semibold self-start
                  hover:bg-[#E2BBFA] transition-colors duration-200">
                Plan your event on WhatsApp
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-6 self-center">
              {EVENT_OPTIONS.map(opt => (
                <div key={opt.text}
                  className="bg-white/[0.08] border border-white/[0.14] rounded-xl p-4
                    flex items-center gap-3">
                  <opt.Icon size={20} className="text-[#E2BBFA] shrink-0"/>
                  <span className="text-white/90 text-[0.85rem]">{opt.text}</span>
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
