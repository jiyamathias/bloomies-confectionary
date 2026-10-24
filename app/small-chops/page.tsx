'use client';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { ToastContainer, useToast } from '@/components/Toast';
import { useCart } from '@/lib/cart';
import { PRODUCTS } from '@/lib/products';
import SectionHeading from '@/components/SectionHeading';

const PLATTERS = [
  {
    id: 'sc-platter-starter',
    name: 'Starter Platter',
    description: 'For small gatherings. A mix of puff-puff, samosa, spring rolls and more.',
    serves: '10–20 guests',
    image: '/images/smallchops-starter.jpg',
    price: 'Custom Pricing',
    category: 'small-chops' as const,
    badge: undefined, badge_color: 'rose' as const,
    in_stock: true, featured: false, sort_order: 1, moq: '',
  },
  {
    id: 'sc-platter-premium',
    name: 'Premium Platter',
    description: 'For mid-size parties. Bigger portions and a wider mix.',
    serves: '30–50 guests',
    image: '/images/smallchops-premium.jpg',
    price: 'Custom Pricing',
    category: 'small-chops' as const,
    badge: 'Popular', badge_color: 'rose' as const,
    in_stock: true, featured: false, sort_order: 2, moq: '',
  },
  {
    id: 'sc-platter-party',
    name: 'Party Platter',
    description: 'For big celebrations. Enough for a full event table.',
    serves: '60–100 guests',
    image: '/images/smallchops-party.jpg',
    price: 'Custom Pricing',
    category: 'small-chops' as const,
    badge: undefined, badge_color: 'rose' as const,
    in_stock: true, featured: false, sort_order: 3, moq: '',
  },
];

export default function SmallChopsPage() {
  const packages  = PRODUCTS.filter(p => p.category === 'small-chops');
  const { add }   = useCart();
  const { toasts, show } = useToast();

  function addPlatter(p: typeof PLATTERS[0]) {
    add({ id: `${p.id}-${Date.now()}`, name: p.name, price: p.price, image: p.image, unitPrice: null });
    show(`${p.name} added to cart`);
  }

  return (
    <>
      <PageHeader
        title="Small Chops"
        subtitle="Platters for house parties, birthdays and big events. Pick a size and we'll confirm the mix with you."
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-14">

        {/* ── Platters ── */}
        <section>
          <SectionHeading className="mb-8" title="Choose a platter size"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATTERS.map((platter) => (
              <div key={platter.id} className="group relative rounded-2xl overflow-hidden
                border border-[rgba(165,140,244,0.15)] bg-white flex flex-col
                hover:shadow-[0_14px_34px_rgba(67,48,117,0.12)]
                transition-shadow duration-200">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={platter.image} alt={platter.name} fill
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(67,48,117,0.6)] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-white text-[#433075] font-semibold
                      text-[0.72rem] px-3 py-1 rounded-full">
                      {platter.serves}
                    </span>
                  </div>
                  {platter.badge && (
                    <span className="absolute top-3 left-3 bg-[#433075] text-white
                      text-[0.68rem] font-bold tracking-[0.08em] px-2.5 py-1 rounded-full uppercase">
                      {platter.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[1.05rem] font-semibold text-[#433075] mb-1">{platter.name}</h3>
                  <p className="text-[0.85rem] text-[#5E5A7C] leading-relaxed mb-4 flex-1">{platter.description}</p>
                  <button
                    onClick={() => addPlatter(platter)}
                    className="w-full flex items-center justify-center gap-2
                      bg-[#433075] text-white py-3 rounded-full text-[0.78rem] font-semibold
                      hover:bg-[#5B3E8A] transition-all duration-250 active:scale-[0.97]">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Existing packages from products ── */}
        {packages.length > 0 && (
          <section>
            <SectionHeading className="mb-8" title="More packages"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map(p => (
                <ProductCard key={p.id} product={p} onToast={show} />
              ))}
            </div>
          </section>
        )}

        {/* ── Custom combo + Event catering cards ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Custom combo — add to cart */}
          <div className="bg-[#F3F0FA] rounded-2xl p-8 sm:p-10 flex flex-col">
            <h3 className="font-luckiest tracking-[0.02em] text-[1.7rem] text-[#433075] leading-tight mb-2">Build your own mix</h3>
            <p className="text-[0.92rem] text-[#5E5A7C] mb-6 leading-relaxed flex-1">
              Want only samosas and spring rolls? Add a custom combo to your cart and tell us the mix
              and guest count when you check out.
            </p>
            <button
              onClick={() => {
                add({ id: `sc-custom-${Date.now()}`, name: 'Custom Small Chops Combo', price: 'Custom Pricing', image: '/images/cat-smallchops.jpg', unitPrice: null });
                show('Custom combo added to cart');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#433075] text-white px-7 py-3.5 rounded-full
                text-[0.85rem] font-semibold hover:bg-[#5B3E8A] transition-all duration-250 w-full sm:w-auto">
              Add custom combo
            </button>
          </div>

          {/* Event catering — goes to WhatsApp directly */}
          <div className="bg-[#433075] rounded-2xl p-8 sm:p-10 flex flex-col">
            <h3 className="font-luckiest tracking-[0.02em] text-[1.7rem] text-white leading-tight mb-2">Catering an event?</h3>
            <p className="text-white/80 text-[0.92rem] mb-6 leading-relaxed flex-1">
              Weddings, office events, big parties: message us with the date and guest count and
              we&apos;ll put together a quote.
            </p>
            <a
              href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20discuss%20small%20chops%20event%20catering!"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#433075] px-7 py-3.5 rounded-full
                text-[0.85rem] font-semibold hover:bg-[#E1D7F0] transition-all duration-250 w-full sm:w-auto">
              Get a catering quote
            </a>
          </div>
        </section>

      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
