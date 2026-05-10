'use client';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { ToastContainer, useToast } from '@/components/Toast';
import { useCart } from '@/lib/cart';
import { PRODUCTS } from '@/lib/products';

const PLATTERS = [
  {
    id: 'sc-platter-starter',
    name: 'Starter Platter',
    description: 'Perfect for intimate gatherings of 10–20 guests. A curated mix of crowd-pleasers.',
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
    description: 'Elevated selection for 30–50 guests. More variety, more wow factor.',
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
    description: 'Go all-out for 60–100 guests. Everything needed for a full celebration spread.',
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
    add({ id: `${p.id}-${Date.now()}`, name: p.name, price: p.price, image: p.image });
    show(`${p.name} added to cart ✓`);
  }

  return (
    <>
      <PageHeader
        title="Small Chops"
        titleEm="Packages"
        subtitle="From intimate house parties to grand celebrations — our packages are crowd-pleasers every single time."
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-14">

        {/* ── Platters ── */}
        <section>
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">
            <span className="w-7 h-px bg-[#A58CF4]" /> Choose Your Platter
          </div>
          <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#433075] font-normal mb-8">
            Select a <em className="italic text-[#A58CF4]">Platter Size</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATTERS.map((platter) => (
              <div key={platter.id} className="group relative rounded-2xl overflow-hidden
                border border-[rgba(165,140,244,0.15)] bg-white flex flex-col
                hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(67,48,117,0.12)]
                transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={platter.image} alt={platter.name} fill
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(67,48,117,0.6)] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white
                      text-[0.68rem] tracking-[0.06em] px-3 py-1 rounded-full">
                      {platter.serves}
                    </span>
                  </div>
                  {platter.badge && (
                    <span className="absolute top-3 left-3 bg-[#433075] text-white
                      text-[0.6rem] font-bold tracking-[0.08em] px-2.5 py-1 rounded-full uppercase">
                      {platter.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#433075] mb-1">{platter.name}</h3>
                  <p className="text-[0.78rem] text-[#6E6A8C] leading-relaxed mb-4 flex-1">{platter.description}</p>
                  <button
                    onClick={() => addPlatter(platter)}
                    className="w-full flex items-center justify-center gap-2
                      bg-[#433075] text-white py-3 rounded-full text-[0.78rem] font-semibold
                      hover:bg-[#A58CF4] transition-all duration-250 active:scale-[0.97]">
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Existing packages from products ── */}
        {packages.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">
              <span className="w-7 h-px bg-[#A58CF4]" /> More Packages
            </div>
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
            <div className="text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">✦ Custom</div>
            <h3 className="font-cormorant text-[1.8rem] text-[#433075] mb-2">Make a Custom Combo</h3>
            <p className="text-[0.88rem] text-[#6E6A8C] mb-6 leading-relaxed flex-1">
              Tell us your guest count, preferences, and occasion — we&apos;ll build the perfect custom combo for you. Add it to your cart, then let us know the details at checkout via WhatsApp.
            </p>
            <button
              onClick={() => {
                add({ id: `sc-custom-${Date.now()}`, name: 'Custom Small Chops Combo', price: 'Custom Pricing', image: '/images/cat-smallchops.jpg' });
                show('Custom Combo added to cart ✓');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#433075] text-white px-7 py-3.5 rounded-full
                text-[0.85rem] font-semibold hover:bg-[#6E6A8C] transition-all duration-250 w-full sm:w-auto">
              + Add Custom Combo to Cart
            </button>
          </div>

          {/* Event catering — goes to WhatsApp directly */}
          <div className="bg-[#433075] rounded-2xl p-8 sm:p-10 flex flex-col">
            <div className="text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">✦ Events</div>
            <h3 className="font-cormorant text-[1.8rem] text-white mb-2">Event Catering</h3>
            <p className="text-white/60 text-[0.88rem] mb-6 leading-relaxed flex-1">
              Planning a corporate event, wedding, or large party? We handle full small chops catering. Discuss your event directly with us on WhatsApp.
            </p>
            <a
              href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20discuss%20small%20chops%20event%20catering!"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#433075] px-7 py-3.5 rounded-full
                text-[0.85rem] font-semibold hover:bg-[#E1D7F0] transition-all duration-250 w-full sm:w-auto">
              💬 Discuss Event Catering
            </a>
          </div>
        </section>

      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
