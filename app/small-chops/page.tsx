'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import CmsImage from '@/components/CmsImage';
import { ToastContainer, useToast } from '@/components/Toast';
import { useCart } from '@/lib/cart';
import { PRODUCTS } from '@/lib/products';
import { useContact, useSection, waLink } from '@/lib/content/store';

export default function SmallChopsPage() {
  const packages = PRODUCTS.filter(p => p.category === 'small-chops');
  const { add } = useCart();
  const { toasts, show } = useToast();
  const head = useSection('smallChops', 'header');
  const platters = useSection('smallChops', 'platters');
  const more = useSection('smallChops', 'packages');
  const combo = useSection('smallChops', 'combo');
  const catering = useSection('smallChops', 'catering');
  const contact = useContact();

  function addPlatter(p: { name: string; image: string }, i: number) {
    add({ id: `sc-platter-${i}-${Date.now()}`, name: p.name, price: 'Custom Pricing', image: p.image, unitPrice: null });
    show(`${p.name} added to cart`);
  }

  return (
    <>
      <PageHeader cms="smallChops.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-14">

        {/* ── Platters ── */}
        {platters.items.length > 0 && (
          <section data-cms="smallChops.platters">
            <SectionHeading className="mb-8" title={platters.title}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {platters.items.map((platter, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden
                  border border-[rgba(165,140,244,0.15)] bg-white flex flex-col
                  hover:shadow-[0_14px_34px_rgba(67,48,117,0.12)] transition-shadow duration-200">
                  <div className="relative h-56 overflow-hidden">
                    <CmsImage src={platter.image} alt={platter.name} fill
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(67,48,117,0.6)] via-transparent to-transparent"/>
                    {platter.serves && (
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-white text-[#433075] font-semibold text-[0.72rem] px-3 py-1 rounded-full">{platter.serves}</span>
                      </div>
                    )}
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
                    <button onClick={() => addPlatter(platter, i)}
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
        )}

        {/* ── Packages from the product catalogue ── */}
        {packages.length > 0 && (
          <section data-cms="smallChops.packages">
            <SectionHeading className="mb-8" title={more.title}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map(p => <ProductCard key={p.id} product={p} onToast={show}/>)}
            </div>
          </section>
        )}

        {/* ── Custom combo + event catering ── */}
        {(combo.visible || catering.visible) && (
          <section className={`grid grid-cols-1 ${combo.visible && catering.visible ? 'lg:grid-cols-2' : ''} gap-5`}>
            {combo.visible && (
              <div data-cms="smallChops.combo" className="bg-[#F3F0FA] rounded-2xl p-8 sm:p-10 flex flex-col">
                <h3 className="font-luckiest tracking-[0.02em] text-[1.7rem] text-[#433075] leading-tight mb-2">{combo.title}</h3>
                <p className="text-[0.92rem] text-[#5E5A7C] mb-6 leading-relaxed flex-1">{combo.body}</p>
                <button
                  onClick={() => {
                    add({ id: `sc-custom-${Date.now()}`, name: 'Custom Small Chops Combo', price: 'Custom Pricing', image: '/images/cat-smallchops.jpg', unitPrice: null });
                    show('Custom combo added to cart');
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[#433075] text-white px-7 py-3.5 rounded-full
                    text-[0.85rem] font-semibold hover:bg-[#5B3E8A] transition-all duration-250 w-full sm:w-auto sm:self-start">
                  {combo.button}
                </button>
              </div>
            )}

            {catering.visible && (
              <div data-cms="smallChops.catering" className="bg-[#433075] rounded-2xl p-8 sm:p-10 flex flex-col">
                <h3 className="font-luckiest tracking-[0.02em] text-[1.7rem] text-white leading-tight mb-2">{catering.title}</h3>
                <p className="text-white/80 text-[0.92rem] mb-6 leading-relaxed flex-1">{catering.body}</p>
                <a href={waLink(contact.whatsapp, catering.message)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#433075] px-7 py-3.5 rounded-full
                    text-[0.85rem] font-semibold hover:bg-[#E1D7F0] transition-all duration-250 w-full sm:w-auto sm:self-start">
                  {catering.button}
                </a>
              </div>
            )}
          </section>
        )}
      </div>

      <ToastContainer toasts={toasts}/>
    </>
  );
}
