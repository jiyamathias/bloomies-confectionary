'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ChevronRight, Star, ArrowRight } from 'lucide-react';
import BestSellers from '@/components/BestSellers';
import HeroBackdrop from '@/components/HeroBackdrop';
import SectionHeading from '@/components/SectionHeading';

const CATS = [
  { label: 'Cakes',              sub: 'One layer · Custom designs',   href: '/cakes',        img: '/images/cat-cakes.jpg'      },
  { label: 'Pastries',           sub: 'Pies · Rolls · Cinnamon buns', href: '/pastries',     img: '/images/cat-pastries.jpg'   },
  { label: 'Small Chops',        sub: 'Packages for every gathering', href: '/small-chops',  img: '/images/cat-smallchops.jpg' },
  { label: 'Daily Treats',       sub: 'Banana bread · Slices · More', href: '/daily-treats', img: '/images/cat-daily.jpg'      },
  { label: 'Corporate & Events', sub: 'Bulk orders · Treat boxes',    href: '/events',       img: '/images/cat-events.jpg'     },
];

const REVIEWS = [
  { q: '"Her treats are the best… my gosh! I\'ve never tasted anything like it."',              name: 'Adaeze O.',  initial: 'A' },
  { q: '"Customer care is absolutely top notch. They communicated every step of the way."',      name: 'Chioma B.', initial: 'C' },
  { q: '"Genuinely the best cakes and pastries I\'ve ever had. Won\'t be going anywhere else."', name: 'Emeka J.',  initial: 'E' },
  { q: '"Always my go-to for pastries. The cinnamon rolls are absolutely to die for."',           name: 'Fatima M.', initial: 'F' },
];

const MARQUEE = [
  '✦ Premium Cakes','✦ Artisan Pastries','✦ Small Chops','✦ Banana Bread',
  '✦ Same-Day Delivery','✦ Custom Designs','✦ Corporate Events','✦ Port Harcourt\'s Finest',
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        {/* 50/50 sliding background images + overlay */}
        <HeroBackdrop/>

        {/* ── Centered hero content ── */}
        <div className="relative z-10 w-full max-w-3xl mx-auto
          px-5 sm:px-6 lg:px-10
          pt-28 pb-20 sm:pt-32 sm:pb-24
          flex flex-col items-center text-center">

          {/* <div className="inline-flex items-center gap-2
            bg-white/90 border border-[rgba(165,140,244,0.3)]
            px-4 py-2 rounded-full shadow-sm mb-7 animate-fade-up">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_,i)=>(<Star key={i} size={10} fill="#A58CF4" className="text-[#A58CF4]"/>))}
            </span>
            <span className="text-[0.7rem] tracking-[0.06em] text-[#6E6A8C] font-medium">
              5.0 · 1,000+ happy clients in Port Harcourt
            </span>
          </div> */}

          <p className="font-luckiest text-white leading-none mb-5 animate-fade-up delay-1"
            style={{ fontSize:'clamp(3.25rem,9vw,7rem)', letterSpacing:'0.02em',
              textShadow:'0 4px 0 rgba(67,48,117,0.55), 0 10px 40px rgba(0,0,0,0.45)' }}>
            Bloomies<span className="text-[#A58CF4]">.</span>
          </p>

          <h1 className="font-luckiest text-white leading-[1.12] mb-8 animate-fade-up delay-2 max-w-2xl"
            style={{ fontSize:'clamp(1.45rem,3.6vw,2.75rem)', letterSpacing:'0.03em',
              textShadow:'0 2px 0 rgba(67,48,117,0.5), 0 6px 28px rgba(0,0,0,0.45)' }}>
            Baked with love,{' '}
            <span className="text-[#D9CCFF]">for people with good taste.</span>
          </h1>

          {/* <p className="leading-relaxed mb-9 max-w-lg animate-fade-up delay-3 font-medium"
            style={{ fontSize:'clamp(0.88rem,1.3vw,1rem)', color:'#2D1F55',
              textShadow:'0 1px 12px rgba(255,255,255,0.9)' }}>
            Premium cakes, pastries &amp; confections crafted fresh every day in Port Harcourt. Every bite, an experience.
          </p> */}

          <div className="flex flex-col sm:flex-row gap-3 mb-7 animate-fade-up delay-3 w-full sm:w-auto">
            <Link href="/cakes"
              className="inline-flex items-center justify-center gap-2
                px-8 py-4 rounded-full font-semibold text-[0.92rem]
                bg-white text-[#433075] shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                hover:bg-[#E2BBFA] transition-colors duration-200 active:scale-[0.97]">
              Order a Cake <ArrowRight size={16}/>
            </Link>
            <a href="#treats"
              className="inline-flex items-center justify-center gap-2
                px-8 py-4 rounded-full font-semibold text-[0.92rem]
                bg-white/10 backdrop-blur-sm border-2 border-white/80 text-white
                hover:bg-white hover:text-[#433075] transition-colors duration-200 active:scale-[0.97]">
              See All Treats
            </a>
          </div>

          <div className="inline-flex items-center gap-2 animate-fade-up delay-4
            bg-white/10 backdrop-blur-sm border border-white/25
            text-white px-4 py-2 rounded-full text-[0.72rem] font-medium mb-9">
            <Zap size={12} fill="currentColor" className="text-[#7EE08A]"/>
            Same-day delivery available on select items
          </div>

          {/* <div className="flex gap-8 sm:gap-12 animate-fade-up delay-5">
            {[['1,000+','Happy Clients'],['★ 5.0','Google Rating'],['Daily','Freshly Baked']].map(([n,l])=>(
              <div key={l}>
                <div className="font-cormorant font-bold leading-none"
                  style={{ fontSize:'clamp(1.4rem,2.8vw,2rem)', color:'#433075',
                    textShadow:'0 2px 16px rgba(255,255,255,0.85)' }}>{n}</div>
                <div className="text-[0.66rem] mt-1 tracking-[0.04em] font-medium"
                  style={{ color:'#2D1F55', textShadow:'0 1px 8px rgba(255,255,255,0.8)' }}>{l}</div>
              </div>
            ))}
          </div> */}
        </div>

      </section>

      {/* ════════════════ MARQUEE ════════════════════ */}
      {/* <div className="overflow-hidden border-y border-[rgba(165,140,244,0.15)]"
        style={{ background:'linear-gradient(90deg,#433075 0%,#5B3E8A 50%,#433075 100%)' }}>
        <div className="marquee-track flex gap-14 py-3.5 w-max">
          {[...MARQUEE,...MARQUEE].map((item,i)=>(
            <span key={i} className="font-cormorant italic text-white/70 whitespace-nowrap text-[0.9rem]">{item}</span>
          ))}
        </div>
      </div> */}

      {/* ════════════════ CATEGORIES ═════════════════ */}
      <section id="treats" className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24">
        <SectionHeading className="mb-8 lg:mb-10"
          title="Pick your treat"
          subtitle="Everything is baked in our Mgbuoba kitchen. Tap a category to see prices and order."/>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="col-span-2 lg:col-span-1">
            <CategoryCard {...CATS[0]} className="h-52 sm:h-60 lg:h-full lg:min-h-[480px]"/>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
            {CATS.slice(1).map(cat=>(
              <CategoryCard key={cat.href} {...cat} className="h-44 sm:h-56"/>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link href="/gallery"
            className="inline-flex items-center gap-1.5 text-[0.8rem] text-[#A58CF4] font-medium hover:gap-3 transition-all duration-200">
            View full gallery <ChevronRight size={13}/>
          </Link>
        </div>
      </section>

      {/* ════════════════ BEST SELLERS ═══════════════ */}
      <div className="border-t border-[rgba(165,140,244,0.12)]"
        style={{ background:'linear-gradient(180deg,#F8F5FF 0%,#FAFAFA 100%)' }}>
        <BestSellers/>
      </div>

      {/* ════════════════ STATS ══════════════════════ */}
      <div className="border-y border-[rgba(165,140,244,0.12)] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[rgba(165,140,244,0.12)]">
            {[['1,000+','Satisfied Clients'],['★ 5.0','Google Rating'],['Same Day','Delivery Available'],['Fresh Daily','Made Every Morning']].map(([n,l])=>(
              <div key={l} className="bg-white px-4 sm:px-6 py-7 sm:py-8 text-center">
                <div className="font-luckiest tracking-[0.02em] text-[#433075] leading-none mb-1.5"
                  style={{ fontSize:'clamp(1.5rem,2.8vw,2.2rem)' }}>{n}</div>
                <div className="text-[0.72rem] sm:text-[0.8rem] text-[#5E5A7C]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ REVIEWS ════════════════════ */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#F3F0FA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <SectionHeading className="mb-8" title="What our customers say"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r,i)=>(
              <figure key={i} className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col
                border border-[rgba(165,140,244,0.18)]">
                <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_,j)=>(<Star key={j} size={13} fill="#433075" className="text-[#433075]"/>))}
                </div>
                <blockquote className="text-[#433075] text-[0.92rem] leading-[1.65] flex-1 mb-5">
                  {r.q}
                </blockquote>
                <figcaption className="pt-4 border-t border-[rgba(165,140,244,0.15)]">
                  <div className="text-[0.85rem] font-semibold text-[#433075]">{r.name}</div>
                  <div className="text-[0.72rem] text-[#5E5A7C]">Google review</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PLATFORMS ══════════════════ */}
      <section className="border-y border-[rgba(165,140,244,0.12)] py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-center">
          <span className="text-[0.85rem] text-[#5E5A7C]">You can also order us on</span>
          {/* TODO: link these to the real Glovo / Chowdeck store pages once we have the URLs */}
          {['Glovo','Chowdeck'].map(label=>(
            <span key={label}
              className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.25)] rounded-full
                px-5 py-2 text-[0.85rem] font-semibold text-[#433075]">
              {label}
            </span>
          ))}
          <div className="hidden sm:block w-px h-5 bg-[rgba(165,140,244,0.2)]"/>
          <span className="flex items-center gap-2 text-[0.85rem] text-[#5E5A7C]">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]"/> Open Mon – Sat, till 5 PM
          </span>
          {/* <span className="flex items-center gap-1.5 text-[0.78rem] text-[#6E6A8C]">
            <MapPin size={12}/> Mgbuoba, Port Harcourt
          </span> */}
        </div>
      </section>

      {/* ════════════════ CUSTOM CTA ═════════════════ */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="rounded-2xl sm:rounded-3xl bg-[#433075] p-8 sm:p-12 lg:p-14
            flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            <div className="shrink-0 hidden lg:flex items-end">
              {[
                { src:'/images/hero/3.webp', rotate:'-5deg', size:'w-24 h-28' },
                { src:'/images/hero/2.webp', rotate:'3deg',  size:'w-32 h-36' },
                { src:'/images/hero/8.webp', rotate:'-3deg', size:'w-24 h-28' },
              ].map((item,i)=>(
                <div key={item.src} className={`${item.size} rounded-xl overflow-hidden relative border-4 border-white shadow-lg ${i ? '-ml-4' : ''}`}
                  style={{ transform:`rotate(${item.rotate})` }}>
                  <Image src={item.src} alt="" fill className="object-cover" sizes="128px"/>
                </div>
              ))}
            </div>
            <div className="text-center lg:text-left flex-1">
              <h2 className="font-luckiest tracking-[0.02em] text-white leading-[1.08] mb-3"
                style={{ fontSize:'clamp(1.7rem,3.5vw,2.6rem)' }}>
                Got a cake idea in your head?
              </h2>
              <p className="text-white/80 text-[0.95rem] mb-7 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Send us a photo or describe it on WhatsApp: size, colours, theme, date. We&apos;ll tell you
                what&apos;s possible and give you a price before we start.
              </p>
              <a href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20place%20a%20custom%20order!"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                  px-7 py-4 rounded-full font-semibold text-[0.92rem]
                  hover:bg-[#E2BBFA] transition-colors duration-200 active:scale-[0.97]">
                <WAIcon dark/> Plan a custom cake
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryCard({ label, sub, href, img, className='' }: {
  label: string; sub: string; href: string; img: string; className?: string;
}) {
  return (
    <Link href={href}
      className={`cat-card group relative rounded-2xl overflow-hidden block
        border border-[rgba(165,140,244,0.1)] ${className}`}>
      <Image src={img} alt={label} fill
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
    <svg viewBox="0 0 24 24" width="16" height="16" fill={dark ? '#433075' : 'white'}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
