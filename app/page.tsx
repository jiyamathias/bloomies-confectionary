'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, MapPin, ChevronRight, Star } from 'lucide-react';
import BestSellers from '@/components/BestSellers';
import HeroBackdrop from '@/components/HeroBackdrop';

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

          <div className="inline-flex items-center gap-2
            bg-white/90 border border-[rgba(165,140,244,0.3)]
            px-4 py-2 rounded-full shadow-sm mb-7 animate-fade-up">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_,i)=>(<Star key={i} size={10} fill="#A58CF4" className="text-[#A58CF4]"/>))}
            </span>
            <span className="text-[0.7rem] tracking-[0.06em] text-[#6E6A8C] font-medium">
              5.0 · 1,000+ happy clients in Port Harcourt
            </span>
          </div>

          <p className="font-cormorant font-bold leading-none mb-4 animate-fade-up delay-1"
            style={{ fontSize:'clamp(3rem,8vw,6.5rem)', color:'#433075', letterSpacing:'-0.02em',
              textShadow:'0 2px 24px rgba(255,255,255,0.8)' }}>
            Bloomies<span style={{ color:'#A58CF4' }}>.</span>
          </p>

          <h1 className="font-cormorant leading-[1.08] mb-7 animate-fade-up delay-2"
            style={{ fontSize:'clamp(1.8rem,4vw,3.4rem)', color:'#433075',
              textShadow:'0 2px 20px rgba(255,255,255,0.75)' }}>
            Baked with love,{' '}
            <em className="font-light italic" style={{ color:'#6B4C9A' }}>
              for people with good taste.
            </em>
          </h1>

          <p className="leading-relaxed mb-9 max-w-lg animate-fade-up delay-3 font-medium"
            style={{ fontSize:'clamp(0.88rem,1.3vw,1rem)', color:'#2D1F55',
              textShadow:'0 1px 12px rgba(255,255,255,0.9)' }}>
            Premium cakes, pastries &amp; confections crafted fresh every day in Port Harcourt. Every bite, an experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-7 animate-fade-up delay-3">
            <a href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 text-white
                px-7 py-4 rounded-full font-semibold text-[0.9rem]
                transition-all duration-300 hover:-translate-y-1 active:scale-[0.97]"
              style={{
                background:'linear-gradient(135deg,#433075 0%,#6B4C9A 100%)',
                boxShadow:'0 8px 28px rgba(67,48,117,0.45)',
              }}>
              <WAIcon/> Order on WhatsApp
            </a>
            <Link href="/cakes"
              className="inline-flex items-center justify-center gap-2
                px-7 py-4 rounded-full font-semibold text-[0.9rem]
                bg-white/90 border-2 border-[#433075] text-[#433075]
                hover:bg-[#433075] hover:text-white hover:-translate-y-1
                transition-all duration-300 active:scale-[0.97]">
              Explore Cakes <ChevronRight size={15}/>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 animate-fade-up delay-4
            bg-white/90 border border-[rgba(46,125,50,0.35)]
            text-[#2E7D32] px-4 py-2 rounded-full text-[0.72rem] font-medium mb-9">
            <Zap size={12} fill="currentColor"/>
            Same-day delivery available on select items
          </div>

          <div className="flex gap-8 sm:gap-12 animate-fade-up delay-5">
            {[['1,000+','Happy Clients'],['★ 5.0','Google Rating'],['Daily','Freshly Baked']].map(([n,l])=>(
              <div key={l}>
                <div className="font-cormorant font-bold leading-none"
                  style={{ fontSize:'clamp(1.4rem,2.8vw,2rem)', color:'#433075',
                    textShadow:'0 2px 16px rgba(255,255,255,0.85)' }}>{n}</div>
                <div className="text-[0.66rem] mt-1 tracking-[0.04em] font-medium"
                  style={{ color:'#2D1F55', textShadow:'0 1px 8px rgba(255,255,255,0.8)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 scroll-hint z-[2] hidden lg:flex flex-col items-center gap-1.5"
          style={{ transform:'translateX(-50%)' }}>
          <span style={{ fontSize:'0.58rem', letterSpacing:'0.16em', color:'rgba(67,48,117,0.4)', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom,rgba(165,140,244,0.5),transparent)' }}/>
        </div>
      </section>

      {/* ════════════════ MARQUEE ════════════════════ */}
      <div className="overflow-hidden border-y border-[rgba(165,140,244,0.15)]"
        style={{ background:'linear-gradient(90deg,#433075 0%,#5B3E8A 50%,#433075 100%)' }}>
        <div className="marquee-track flex gap-14 py-3.5 w-max">
          {[...MARQUEE,...MARQUEE].map((item,i)=>(
            <span key={i} className="font-cormorant italic text-white/70 whitespace-nowrap text-[0.9rem]">{item}</span>
          ))}
        </div>
      </div>

      {/* ════════════════ CATEGORIES ═════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-7 h-px bg-[#A58CF4]"/>
              <span className="text-[0.68rem] tracking-[0.2em] uppercase text-[#A58CF4] font-medium">Our Collections</span>
            </div>
            <h2 className="font-cormorant font-normal text-[#433075] leading-tight"
              style={{ fontSize:'clamp(1.9rem,4vw,3.2rem)' }}>
              Everything Sweet<br/>
              <em className="italic font-light text-[#A58CF4]">&amp; Savory</em>
            </h2>
          </div>
          <p className="text-[0.85rem] text-[#6E6A8C] max-w-xs leading-relaxed">
            Every item made fresh daily. Tap a category to explore.
          </p>
        </div>

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
                <div className="font-cormorant font-bold text-[#433075] leading-none mb-1"
                  style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)' }}>{n}</div>
                <div className="text-[0.65rem] sm:text-[0.72rem] text-[#6E6A8C] tracking-[0.05em] uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ REVIEWS ════════════════════ */}
      <section className="py-12 sm:py-16 lg:py-24"
        style={{ background:'linear-gradient(180deg,#FAFAFA 0%,#F3F0FA 100%)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-px bg-[#A58CF4]"/>
            <span className="text-[0.68rem] tracking-[0.2em] uppercase text-[#A58CF4] font-medium">Client Love</span>
          </div>
          <h2 className="font-cormorant font-normal text-[#433075] mb-8"
            style={{ fontSize:'clamp(1.9rem,4vw,3.2rem)' }}>
            What People Are <em className="italic font-light text-[#A58CF4]">Saying</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r,i)=>(
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col
                border border-[rgba(165,140,244,0.12)]
                hover:border-[#A58CF4]/35 hover:shadow-[0_16px_48px_rgba(67,48,117,0.09)]
                transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_,j)=>(<Star key={j} size={11} fill="#A58CF4" className="text-[#A58CF4]"/>))}
                </div>
                <p className="font-cormorant italic text-[#433075] leading-[1.65] flex-1 mb-5"
                  style={{ fontSize:'clamp(0.98rem,1.5vw,1.08rem)' }}>
                  {r.q}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(165,140,244,0.1)]">
                  <div className="w-8 h-8 rounded-full bg-[#433075] flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0">
                    {r.initial}
                  </div>
                  <div>
                    <div className="text-[0.82rem] font-semibold text-[#433075]">{r.name}</div>
                    <div className="text-[0.65rem] text-[#6E6A8C]">Google Review</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PLATFORMS ══════════════════ */}
      <section className="border-y border-[rgba(165,140,244,0.12)] py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="text-[0.68rem] tracking-[0.14em] uppercase text-[#6E6A8C]/60 font-medium">Also available on</span>
          {[['🟢 Glovo','#'],['🟠 Chowdeck','#']].map(([label,href])=>(
            <a key={label} href={href}
              className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.2)] rounded-full
                px-5 py-2 text-[0.82rem] font-medium text-[#433075]
                hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              {label}
            </a>
          ))}
          <div className="hidden sm:block w-px h-5 bg-[rgba(165,140,244,0.2)]"/>
          <span className="flex items-center gap-2 text-[0.78rem] text-[#6E6A8C]">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]"/> Mon – Sat · Closes 5 PM
          </span>
          <span className="flex items-center gap-1.5 text-[0.78rem] text-[#6E6A8C]">
            <MapPin size={12}/> Mgbuoba, Port Harcourt
          </span>
        </div>
      </section>

      {/* ════════════════ CUSTOM CTA ═════════════════ */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16
            flex flex-col lg:flex-row items-center gap-8 lg:gap-14"
            style={{ background:'linear-gradient(135deg,#433075 0%,#2D1F55 60%,#1A1035 100%)' }}>
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#A58CF4,transparent)' }}/>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#E1D7F0,transparent)' }}/>
            <div className="relative shrink-0 hidden lg:flex gap-3 items-center">
              {[
                { src:'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=200&q=80&fit=crop', rotate:'-6deg', w:'w-20 h-20' },
                { src:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=250&q=80&fit=crop', rotate:'3deg',  w:'w-28 h-28' },
                { src:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=180&q=80&fit=crop', rotate:'-4deg', w:'w-16 h-16' },
              ].map((item,i)=>(
                <div key={i} className={`${item.w} rounded-xl overflow-hidden shadow-xl relative -ml-3 first:ml-0`}
                  style={{ transform:`rotate(${item.rotate})` }}>
                  <Image src={item.src} alt="" fill className="object-cover" sizes="128px" unoptimized/>
                </div>
              ))}
            </div>
            <div className="relative z-10 text-center lg:text-left flex-1">
              <div className="text-[0.68rem] tracking-[0.2em] uppercase text-[#A58CF4] mb-3">✦ Custom Orders</div>
              <h2 className="font-cormorant text-white mb-3 font-normal"
                style={{ fontSize:'clamp(1.7rem,3.5vw,2.8rem)' }}>
                Didn&apos;t find what you&apos;re looking for?
                <em className="italic font-light text-[#E1D7F0] block">Place a custom order.</em>
              </h2>
              <p className="text-white/55 text-[0.88rem] mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Share a reference photo on WhatsApp and let&apos;s create something extraordinary together.
              </p>
              <a href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20place%20a%20custom%20order!"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white text-[#433075]
                  px-8 py-4 rounded-full font-semibold text-[0.9rem]
                  hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 active:scale-[0.97]">
                <WAIcon dark/> Order via WhatsApp
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"/>
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm
        flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/90 transition-all duration-300">
        <ChevronRight size={13} className="text-[#433075]"/>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-cormorant text-white font-semibold leading-tight mb-0.5"
          style={{ fontSize:'clamp(1.1rem,2vw,1.5rem)' }}>{label}</div>
        <div className="text-white/60 text-[0.67rem] sm:text-[0.7rem]">{sub}</div>
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
