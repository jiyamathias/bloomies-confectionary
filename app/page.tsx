'use client';
import Link from 'next/link';
import { Zap, ChevronRight, Star, ArrowRight } from 'lucide-react';
import BestSellers from '@/components/BestSellers';
import HeroBackdrop from '@/components/HeroBackdrop';
import SectionHeading from '@/components/SectionHeading';
import CmsImage from '@/components/CmsImage';
import { useContact, useSection, waLink } from '@/lib/content/store';

// Every text and photo on this page comes from the CMS (Admin → Website content → Home).
const CATEGORY_LINKS = [
  { key: 'cakes', href: '/cakes' },
  { key: 'pastries', href: '/pastries' },
  { key: 'chops', href: '/small-chops' },
  { key: 'daily', href: '/daily-treats' },
  { key: 'events', href: '/events' },
] as const;

export default function HomePage() {
  const hero = useSection('home', 'hero');
  const cats = useSection('home', 'categories');
  const stats = useSection('home', 'stats');
  const reviews = useSection('home', 'reviews');
  const platforms = useSection('home', 'platforms');
  const cta = useSection('home', 'customCta');
  const contact = useContact();

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section data-cms="home.hero" className="relative overflow-hidden min-h-screen flex items-center">
        <HeroBackdrop slides={hero.slides}/>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-6 lg:px-10
          pt-28 pb-20 sm:pt-32 sm:pb-24 flex flex-col items-center text-center">

          <p className="font-luckiest text-white leading-none mb-5 animate-fade-up delay-1"
            style={{ fontSize:'clamp(3.25rem,9vw,7rem)', letterSpacing:'0.02em',
              textShadow:'0 4px 0 rgba(67,48,117,0.55), 0 10px 40px rgba(0,0,0,0.45)' }}>
            {hero.brand}<span className="text-[#A58CF4]">.</span>
          </p>

          <h1 className="font-luckiest text-white leading-[1.12] mb-8 animate-fade-up delay-2 max-w-2xl"
            style={{ fontSize:'clamp(1.45rem,3.6vw,2.75rem)', letterSpacing:'0.03em',
              textShadow:'0 2px 0 rgba(67,48,117,0.5), 0 6px 28px rgba(0,0,0,0.45)' }}>
            {hero.headline}{' '}
            <span className="text-[#D9CCFF]">{hero.highlight}</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-7 animate-fade-up delay-3 w-full sm:w-auto">
            <Link href="/cakes"
              className="inline-flex items-center justify-center gap-2
                px-8 py-4 rounded-full font-semibold text-[0.92rem]
                bg-white text-[#433075] shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                hover:bg-[#E2BBFA] transition-colors duration-200 active:scale-[0.97]">
              {hero.primaryLabel} <ArrowRight size={16}/>
            </Link>
            <a href="#treats"
              className="inline-flex items-center justify-center gap-2
                px-8 py-4 rounded-full font-semibold text-[0.92rem]
                bg-white/10 backdrop-blur-sm border-2 border-white/80 text-white
                hover:bg-white hover:text-[#433075] transition-colors duration-200 active:scale-[0.97]">
              {hero.secondaryLabel}
            </a>
          </div>

          {hero.badge && (
            <div className="inline-flex items-center gap-2 animate-fade-up delay-4
              bg-white/10 backdrop-blur-sm border border-white/25
              text-white px-4 py-2 rounded-full text-[0.72rem] font-medium mb-9">
              <Zap size={12} fill="currentColor" className="text-[#7EE08A]"/>
              {hero.badge}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section id="treats" data-cms="home.categories" className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24">
        <SectionHeading className="mb-8 lg:mb-10" title={cats.title} subtitle={cats.subtitle}/>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="col-span-2 lg:col-span-1">
            <CategoryCard {...cats.cakes} href="/cakes" className="h-52 sm:h-60 lg:h-full lg:min-h-[480px]"/>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
            {CATEGORY_LINKS.slice(1).map(({ key, href }) => (
              <CategoryCard key={key} {...cats[key]} href={href} className="h-44 sm:h-56"/>
            ))}
          </div>
        </div>

        {cats.galleryLink && (
          <div className="mt-5 text-center">
            <Link href="/gallery"
              className="inline-flex items-center gap-1.5 py-2.5 text-[0.88rem] text-[#433075] font-semibold hover:gap-3 transition-all duration-200">
              {cats.galleryLink} <ChevronRight size={13}/>
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════════ BEST SELLERS ═══════════════ */}
      <div data-cms="home.bestSellers" className="border-t border-[rgba(165,140,244,0.12)]"
        style={{ background:'linear-gradient(180deg,#F8F5FF 0%,#FAFAFA 100%)' }}>
        <BestSellers/>
      </div>

      {/* ═══════════════ STATS ═══════════════ */}
      {stats.visible && stats.items.length > 0 && (
        <div data-cms="home.stats" className="border-y border-[rgba(165,140,244,0.12)] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className={`grid grid-cols-2 ${stats.items.length >= 4 ? 'lg:grid-cols-4' : stats.items.length === 3 ? 'lg:grid-cols-3' : ''}
              divide-x divide-y lg:divide-y-0 divide-[rgba(165,140,244,0.12)]`}>
              {stats.items.map((s, i) => (
                <div key={i} className="bg-white px-4 sm:px-6 py-7 sm:py-8 text-center">
                  <div className="font-luckiest tracking-[0.02em] text-[#433075] leading-none mb-1.5"
                    style={{ fontSize:'clamp(1.5rem,2.8vw,2.2rem)' }}>{s.value}</div>
                  <div className="text-[0.72rem] sm:text-[0.8rem] text-[#5E5A7C]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ REVIEWS ═══════════════ */}
      {reviews.visible && reviews.items.length > 0 && (
        <section data-cms="home.reviews" className="py-12 sm:py-16 lg:py-24 bg-[#F3F0FA]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <SectionHeading className="mb-8" title={reviews.title}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviews.items.map((r, i) => (
                <figure key={i} className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col border border-[rgba(165,140,244,0.18)]">
                  <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, j) => (<Star key={j} size={13} fill="#433075" className="text-[#433075]"/>))}
                  </div>
                  <blockquote className="text-[#433075] text-[0.92rem] leading-[1.65] flex-1 mb-5">{r.quote}</blockquote>
                  <figcaption className="pt-4 border-t border-[rgba(165,140,244,0.15)]">
                    <div className="text-[0.85rem] font-semibold text-[#433075]">{r.name}</div>
                    {r.source && <div className="text-[0.72rem] text-[#5E5A7C]">{r.source}</div>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ PLATFORMS ═══════════════ */}
      {platforms.visible && (
        <section data-cms="home.platforms" className="border-y border-[rgba(165,140,244,0.12)] py-6 sm:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-center">
            {platforms.items.length > 0 && <span className="text-[0.85rem] text-[#5E5A7C]">{platforms.intro}</span>}
            {platforms.items.map((p, i) => {
              const cls = 'bg-[#F3F0FA] border border-[rgba(165,140,244,0.25)] rounded-full px-5 py-2 text-[0.85rem] font-semibold text-[#433075]';
              return p.url
                ? <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-[#E2BBFA] transition-colors`}>{p.name}</a>
                : <span key={i} className={cls}>{p.name}</span>;
            })}
            {platforms.items.length > 0 && <div className="hidden sm:block w-px h-5 bg-[rgba(165,140,244,0.2)]"/>}
            <span className="flex items-center gap-2 text-[0.85rem] text-[#5E5A7C]">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50]"/> Open {contact.hours}
            </span>
          </div>
        </section>
      )}

      {/* ═══════════════ CUSTOM CTA ═══════════════ */}
      {cta.visible && (
        <section data-cms="home.customCta" className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <div className="rounded-2xl sm:rounded-3xl bg-[#433075] p-8 sm:p-12 lg:p-14
              flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
              <div className="shrink-0 hidden lg:flex items-end">
                {[
                  { src: cta.image1, rotate: '-5deg', size: 'w-24 h-28' },
                  { src: cta.image2, rotate: '3deg',  size: 'w-32 h-36' },
                  { src: cta.image3, rotate: '-3deg', size: 'w-24 h-28' },
                ].filter(x => x.src).map((item, i) => (
                  <div key={i} className={`${item.size} rounded-xl overflow-hidden relative border-4 border-white shadow-lg ${i ? '-ml-4' : ''}`}
                    style={{ transform: `rotate(${item.rotate})` }}>
                    <CmsImage src={item.src} alt="" fill className="object-cover" sizes="128px"/>
                  </div>
                ))}
              </div>
              <div className="text-center lg:text-left flex-1">
                <h2 className="font-luckiest tracking-[0.02em] text-white leading-[1.08] mb-3"
                  style={{ fontSize:'clamp(1.7rem,3.5vw,2.6rem)' }}>
                  {cta.title}
                </h2>
                <p className="text-white/80 text-[0.95rem] mb-7 max-w-lg mx-auto lg:mx-0 leading-relaxed">{cta.body}</p>
                <a href={waLink(contact.whatsapp, cta.message)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                    px-7 py-4 rounded-full font-semibold text-[0.92rem]
                    hover:bg-[#E2BBFA] transition-colors duration-200 active:scale-[0.97]">
                  <WAIcon dark/> {cta.button}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function CategoryCard({ label, sub, href, image, className = '' }: {
  label: string; sub: string; href: string; image: string; className?: string;
}) {
  return (
    <Link href={href}
      className={`cat-card group relative rounded-2xl overflow-hidden block
        border border-[rgba(165,140,244,0.1)] ${className}`}>
      <CmsImage src={image} alt={label} fill
        sizes="(max-width:640px) 50vw,(max-width:1024px) 50vw,33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm
        flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/90 transition-all duration-300">
        <ChevronRight size={13} className="text-[#433075]"/>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-luckiest tracking-[0.03em] text-white leading-tight mb-1"
          style={{ fontSize:'clamp(1.15rem,2vw,1.6rem)' }}>{label}</div>
        <div className="text-white/85 text-[0.72rem] sm:text-[0.78rem]">{sub}</div>
      </div>
    </Link>
  );
}

function WAIcon({ dark }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={dark ? '#433075' : 'white'} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
