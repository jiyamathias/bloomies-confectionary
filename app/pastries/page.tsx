'use client';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { ToastContainer, useToast } from '@/components/Toast';
import { PRODUCTS } from '@/lib/products';
import { useContact, useSection, waLink } from '@/lib/content/store';

export default function PastriesPage() {
  const { toasts, show } = useToast();
  const head = useSection('pastries', 'header');
  const cta = useSection('pastries', 'cta');
  const contact = useContact();
  const products = PRODUCTS.filter(p => p.category === 'pastries');

  return (
    <>
      <PageHeader cms="pastries.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onToast={show} />
          ))}
        </div>
      </div>

      {cta.visible && (
      <div data-cms="pastries.cta" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pb-14">
        <div className="bg-[#433075] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-luckiest tracking-[0.02em] text-[1.8rem] text-white leading-tight mb-2">
              {cta.title}
            </h3>
            <p className="text-white/80 text-[0.92rem]">{cta.body}</p>
          </div>
          <WhatsAppBtn
            href={waLink(contact.whatsapp, cta.message)}
            className="px-8 py-4 text-[0.88rem] shrink-0">
            {cta.button}
          </WhatsAppBtn>
        </div>
      </div>
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
