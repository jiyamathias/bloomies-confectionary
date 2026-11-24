'use client';
import PageHeader from '@/components/PageHeader';
import RichText from '@/components/RichText';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { Clock, MapPin } from 'lucide-react';
import { useContact, useSection, waLink } from '@/lib/content/store';

// Sections, their order and wording come from the CMS (Admin → Website content → Policy).
export default function PolicyPage() {
  const head = useSection('policy', 'header');
  const { items } = useSection('policy', 'sections');
  const box = useSection('policy', 'contact');
  const contact = useContact();

  return (
    <>
      <PageHeader cms="policy.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div data-cms="policy.sections" className="space-y-5">
          {items.map((s, i) => (
            <section key={i} className="bg-white border border-[rgba(165,140,244,0.14)] rounded-2xl p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-9 h-9 rounded-full bg-[#E2BBFA]
                  flex items-center justify-center font-luckiest text-[1.05rem] text-[#433075] pt-0.5">
                  {String.fromCharCode(65 + (i % 26))}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[1.08rem] font-semibold text-[#433075] mb-2 leading-snug">{s.title}</h2>
                  <RichText text={s.body} className="text-[0.92rem] text-[#5E5A7C] leading-relaxed space-y-3"
                    listClassName="list-disc pl-5 space-y-2 marker:text-[#A58CF4]"/>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact / questions */}
        <div data-cms="policy.contact" className="mt-8 bg-[#433075] rounded-2xl p-7 sm:p-9 text-center sm:text-left
          sm:flex sm:items-center sm:justify-between gap-6">
          <div className="mb-5 sm:mb-0">
            <h3 className="font-luckiest tracking-[0.02em] text-[1.5rem] text-white mb-2">{box.title}</h3>
            <div className="space-y-1.5">
              <p className="text-white/80 text-[0.85rem] flex items-center gap-2 justify-center sm:justify-start">
                <Clock size={13}/> {contact.hours} · {contact.closed}
              </p>
              {contact.address && (
                <p className="text-white/80 text-[0.85rem] flex items-center gap-2 justify-center sm:justify-start">
                  <MapPin size={13}/> {contact.address}
                </p>
              )}
            </div>
          </div>
          <WhatsAppBtn href={waLink(contact.whatsapp, box.message)} className="px-7 py-3.5 text-[0.85rem] shrink-0">
            {box.button}
          </WhatsAppBtn>
        </div>

        {box.updated && <p className="text-[0.75rem] text-[#5E5A7C] text-center mt-6">{box.updated}</p>}
      </div>
    </>
  );
}
