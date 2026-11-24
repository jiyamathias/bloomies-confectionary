'use client';
import PageHeader from '@/components/PageHeader';
import SectionHeading from '@/components/SectionHeading';
import CmsImage from '@/components/CmsImage';
import RichText from '@/components/RichText';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { Star, Zap, ChefHat, MessageCircle, Heart } from 'lucide-react';
import { useContact, useSection, waLink } from '@/lib/content/store';

// Icons follow the order of the "Why Bloomies" list in the CMS.
const REASON_ICONS = [ChefHat, Zap, MessageCircle, Heart];

export default function AboutPage() {
  const head = useSection('about', 'header');
  const story = useSection('about', 'story');
  const owner = useSection('about', 'owner');
  const reviews = useSection('about', 'reviews');
  const contact = useContact();

  return (
    <>
      <PageHeader cms="about.header" title={head.title} subtitle={head.subtitle} badge={head.tag}/>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">
        {/* ── The bakery ── */}
        <div data-cms="about.story" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <CmsImage src={story.image} alt="Cakes made by Bloomies"
                fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw"/>
            </div>
            {story.badgeValue && (
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border
                border-[rgba(165,140,244,0.25)] rounded-2xl px-5 py-4
                shadow-[0_12px_32px_rgba(67,48,117,0.12)] text-center">
                <span className="font-luckiest tracking-[0.02em] text-[2rem] text-[#433075] block leading-none">{story.badgeValue}</span>
                <span className="flex justify-center gap-0.5 my-1" aria-hidden>
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#433075" className="text-[#433075]"/>)}
                </span>
                <span className="text-[0.72rem] text-[#5E5A7C]">{story.badgeLabel}</span>
              </div>
            )}
          </div>

          <div>
            <SectionHeading className="mb-5" title={story.title}/>
            <RichText text={story.body} className="text-[0.95rem] text-[#5E5A7C] leading-relaxed space-y-4 mb-8"/>

            <div className="space-y-5 mb-8">
              {story.reasons.map((w, i) => {
                const Icon = REASON_ICONS[i % REASON_ICONS.length];
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#E2BBFA] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#433075]"/>
                    </div>
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-[#433075] mb-0.5">{w.title}</h3>
                      <p className="text-[0.88rem] text-[#5E5A7C] leading-relaxed">{w.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <WhatsAppBtn href={waLink(contact.whatsapp, story.message)} className="px-8 py-4 text-[0.88rem]">
              {story.button}
            </WhatsAppBtn>
          </div>
        </div>

        {/* ── The baker ── */}
        {owner.visible && (
          <div data-cms="about.owner" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div>
              <SectionHeading className="mb-5" title={owner.title}/>
              <RichText text={owner.body} className="text-[0.95rem] text-[#5E5A7C] leading-relaxed space-y-4 mb-8"/>
              {owner.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {owner.tags.map((t, i) => (
                    <span key={i} className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.3)]
                      text-[#433075] text-[0.8rem] font-medium px-4 py-2 rounded-full">{t.text}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
                <CmsImage src={owner.image} alt="The baker behind Bloomies"
                  fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw"/>
              </div>
              {owner.badgeValue && (
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#433075]
                  rounded-2xl px-5 py-4 shadow-[0_12px_32px_rgba(67,48,117,0.2)] text-center">
                  <span className="font-luckiest tracking-[0.02em] text-[1.6rem] text-white block leading-none">{owner.badgeValue}</span>
                  <span className="text-[0.75rem] text-white/80">{owner.badgeLabel}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {reviews.visible && reviews.items.length > 0 && (
          <div id="reviews" data-cms="about.reviews" className="scroll-mt-24">
            <SectionHeading className="mb-8" title={reviews.title}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reviews.items.map((r, i) => (
                <figure key={i} className="bg-white rounded-2xl p-6 border border-[rgba(165,140,244,0.18)]">
                  <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#433075" className="text-[#433075]"/>)}
                  </div>
                  <blockquote className="text-[0.95rem] text-[#433075] leading-[1.7] mb-4">{r.quote}</blockquote>
                  <figcaption>
                    <span className="text-[0.85rem] font-semibold text-[#433075] block">{r.name}</span>
                    {r.source && <span className="text-[0.75rem] text-[#5E5A7C]">{r.source}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
