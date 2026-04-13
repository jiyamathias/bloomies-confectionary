'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, MapPin, ChevronRight } from 'lucide-react';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import BestSellers from '@/components/BestSellers';

const CATS = [
  { label: 'Cakes',              sub: 'One layer · Custom designs',    href: '/cakes',        img: '/images/hero-real.jpg',           tall: true  },
  { label: 'Pastries',           sub: 'Pies · Rolls · Donuts',         href: '/pastries',     img: '/images/cat-pastries.jpg',        tall: false },
  { label: 'Small Chops',        sub: 'Packages for every gathering',  href: '/small-chops',  img: '/images/cat-smallchops.jpg',      tall: false },
  { label: 'Daily Treats',       sub: 'Banana bread · Slices · More',  href: '/daily-treats', img: '/images/cat-daily.jpg',           tall: false },
  { label: 'Corporate & Events', sub: 'Bulk orders · Treat boxes',     href: '/events',       img: '/images/cat-events.jpg',          tall: false },
];

const REVIEWS = [
  { q: '"Her treats are the best… my gosh! I\'ve never tasted anything like it."',              name: 'Adaeze O.' },
  { q: '"Customer care is absolutely top notch. They communicated every step of the way."',      name: 'Chioma B.' },
  { q: '"Excellent delivery and genuinely the best cakes and pastries I\'ve ever had."',          name: 'Emeka J.'  },
  { q: '"Always my go-to for pastries. The cinnamon rolls are absolutely to die for."',           name: 'Fatima M.' },
];

const MARQUEE = [
  'Premium Cakes','Artisan Pastries','Small Chops','Banana Bread',
  'Same Day Delivery','Custom Designs','Corporate Events','Port Harcourt\'s Finest',
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════ HERO ══════════════════════════ */}
      <section className="relative min-h-[94vh] sm:min-h-[92vh] flex flex-col items-center
        justify-center text-center px-6 overflow-hidden">

        {/* Real hero background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-real.jpg" alt="Bloomies Cakes" fill
            className="object-cover object-center" priority quality={95} />
          {/* Pink-tinted overlay — brand primary */}
          <div className="absolute inset-0 bg-gradient-to-b
            from-[rgba(255,240,248,0.82)] via-[rgba(253,240,250,0.78)] to-[rgba(250,240,255,0.88)]" />
        </div>

        {/* Soft glow blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-[1]
          bg-[radial-gradient(circle,rgba(232,96,154,0.25),transparent_65%)]
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none z-[1]
          bg-[radial-gradient(circle,rgba(212,196,232,0.3),transparent_65%)]
          top-[5%] right-[-5%]" />

        <div className="relative z-[2] flex flex-col items-center max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm
            border border-[rgba(232,96,154,0.3)] px-5 py-2 rounded-full
            text-[0.72rem] tracking-[0.08em] text-[#7B5EA7] mb-6 shadow-sm
            animate-fade-up">
            <span className="text-[#9B7EC8]">★★★★★</span>
            5.0 Rating &nbsp;·&nbsp; 1,000+ Happy Clients
          </div>

          <h1 className="font-cormorant text-[clamp(3rem,8vw,6rem)] font-normal leading-[1.04]
            text-[#5B2D8E] mb-4 animate-fade-up delay-1">
            Crafted with Love,<br />
            <em className="italic text-[#E8609A]">Baked to Impress</em>
          </h1>

          <p className="font-cormorant italic text-[1.1rem] text-[#9B7EC8] mb-8 opacity-85
            animate-fade-up delay-2">
            When quality matters, choose Bloomies.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-up delay-3">
            <Link href="/cakes"
              className="bg-[#E8609A] text-white px-8 py-4 rounded-full text-[0.88rem]
                font-semibold tracking-[0.04em]
                hover:bg-[#D03878] hover:-translate-y-0.5
                hover:shadow-[0_12px_30px_rgba(232,96,154,0.4)]
                transition-all duration-300 active:scale-[0.97] text-center">
              Explore Our Cakes ✨
            </Link>
            <WhatsAppBtn
              href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
              className="px-8 py-4 text-[0.88rem] font-semibold">
              WhatsApp Us
            </WhatsAppBtn>
          </div>

          {/* Same-day tag */}
          <div className="mt-6 inline-flex items-center gap-2 animate-fade-up delay-4
            bg-[rgba(92,184,92,0.12)] border border-[rgba(92,184,92,0.3)]
            text-[#3A7A3A] px-4 py-2 rounded-full text-[0.72rem] font-medium">
            <Zap size={12} /> Same-day delivery available on select items
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 scroll-hint z-[2]
          flex flex-col items-center gap-2 text-[0.65rem] tracking-[0.14em] uppercase text-[#9B7EC8]/50">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E8609A] to-transparent" />
        </div>
      </section>

      {/* ══════════════════════ MARQUEE ══════════════════════════ */}
      <div className="bg-[#5B2D8E] py-4 overflow-hidden">
        <div className="marquee-track flex gap-14 w-max">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="font-cormorant italic text-[0.95rem] text-white/65
              whitespace-nowrap flex items-center gap-5">
              {item}
              <span className="text-[#E8609A] not-italic text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════ CATEGORIES ══════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#E8609A] mb-3">
            <span className="w-7 h-px bg-[#E8609A]" /> Our Collections
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-normal text-[#5B2D8E]">
            Everything Sweet <em className="italic text-[#E8609A]">&amp; Savory</em>
          </h2>
          <p className="text-[0.9rem] text-[#7B5EA7] mt-2 max-w-md leading-relaxed">
            Tap a category to explore. Every item is made fresh — with care and quality you can taste.
          </p>
        </div>

        {/* ── BENTO GRID ──
            Mobile:  single column stack
            Tablet:  2-column
            Desktop: 3-col, cakes spans 2 rows on left
        ── */}
        <div className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        ">
          {/* Cakes — tall on desktop */}
          <BentoTile
            {...CATS[0]}
            className="
              h-64
              sm:h-72
              lg:row-span-2 lg:h-full lg:min-h-[480px]
            "
          />
          {/* Other 4 tiles */}
          {CATS.slice(1).map((cat) => (
            <BentoTile
              key={cat.href}
              {...cat}
              className="h-48 sm:h-56 lg:h-56"
            />
          ))}
        </div>

        {/* Gallery link */}
        <div className="mt-5 text-center">
          <Link href="/gallery"
            className="inline-flex items-center gap-2 text-[0.82rem] text-[#E8609A]
              font-medium hover:underline">
            View our full cake gallery →
          </Link>
        </div>
      </section>

      {/* ══════════════════ BEST SELLERS ══════════════════════ */}
      <div className="border-t border-[rgba(232,96,154,0.1)]">
        <BestSellers />
      </div>

      {/* ══════════════════════ STATS ══════════════════════════ */}
      <div className="border-y border-[rgba(232,96,154,0.15)] mx-6 lg:mx-10 overflow-hidden rounded-2xl mb-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0
            divide-[rgba(232,96,154,0.15)]">
            {[['1,000+','Satisfied Clients'],['★ 5.0','Google Rating'],['Same Day','Delivery Available'],['Daily','Freshly Baked']].map(([n,l]) => (
              <div key={l} className="bg-white px-6 py-8 text-center">
                <span className="font-cormorant text-[2.2rem] lg:text-[2.6rem] font-semibold
                  text-[#E8609A] block leading-none mb-2">{n}</span>
                <span className="text-[0.75rem] text-[#7B5EA7] tracking-[0.06em]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ REVIEWS ══════════════════════════ */}
      <section className="bg-[#F0EBFF] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#E8609A] mb-3">
            <span className="w-7 h-px bg-[#E8609A]" /> Client Love
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-normal text-[#5B2D8E] mb-8">
            What People Are <em className="italic text-[#E8609A]">Saying</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[rgba(232,96,154,0.15)]
                hover:border-[#E8DAFF] hover:shadow-[0_12px_30px_rgba(232,96,154,0.1)]
                transition-all duration-300">
                <div className="text-[#9B7EC8] text-[0.82rem] mb-3">★★★★★</div>
                <p className="font-cormorant italic text-[1.05rem] text-[#5B2D8E] leading-[1.65] mb-4">{r.q}</p>
                <span className="text-[0.78rem] font-semibold text-[#5B2D8E] block">{r.name}</span>
                <span className="text-[0.7rem] text-[#7B5EA7]">Google Review</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PLATFORMS ══════════════════════════ */}
      <section className="py-10 border-b border-[rgba(232,96,154,0.12)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10
          flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-[0.72rem] tracking-[0.14em] uppercase text-[#7B5EA7]/70">Also order via</span>
          {[['🟢 Glovo','#'],['🟠 Chowdeck','#']].map(([label, href]) => (
            <a key={label} href={href}
              className="bg-white border border-[rgba(232,96,154,0.2)] rounded-full
                px-6 py-2.5 text-[0.85rem] font-medium text-[#5B2D8E] shadow-sm
                hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              {label}
            </a>
          ))}
          <div className="hidden sm:block w-px h-5 bg-[rgba(232,96,154,0.2)]" />
          <span className="flex items-center gap-2 text-[0.8rem] text-[#7B5EA7]">
            <span className="w-2 h-2 rounded-full bg-[#5CB85C]" /> Open daily · Closes 5 PM
          </span>
          <span className="flex items-center gap-1.5 text-[0.8rem] text-[#7B5EA7]">
            <MapPin size={13} /> Mgbuoba, Port Harcourt
          </span>
        </div>
      </section>

      {/* ══════════════════════ CUSTOM CTA ══════════════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-gradient-to-br from-[#E8609A] to-[#D03878] rounded-2xl lg:rounded-3xl
            p-8 sm:p-12 lg:p-16 flex flex-col sm:flex-row items-center justify-between
            gap-8 text-center sm:text-left relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/8 pointer-events-none" />
            <div className="relative z-[1]">
              <h2 className="font-cormorant text-[clamp(1.8rem,4vw,2.8rem)] text-white font-normal mb-2">
                Didn&apos;t find what you&apos;re looking for?{' '}
                <em className="italic text-white/80">Place a custom order.</em>
              </h2>
              <p className="text-white/70 text-[0.9rem] max-w-lg">
                We love bringing unique visions to life. Send us a reference and let&apos;s create something extraordinary together.
              </p>
            </div>
            <a
              href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%27d%20like%20to%20place%20a%20custom%20order!"
              target="_blank" rel="noopener noreferrer"
              className="relative z-[1] inline-flex items-center gap-2.5 bg-white text-[#E8609A]
                px-8 py-4 rounded-full font-semibold text-[0.88rem] whitespace-nowrap shrink-0
                hover:bg-[#FAFAFE] hover:-translate-y-0.5
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                transition-all duration-300 active:scale-[0.97]">
              💬 Custom Order
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function BentoTile({ label, sub, href, img, className = '' }: {
  label: string; sub: string; href: string; img: string; className?: string; tall?: boolean;
}) {
  return (
    <Link href={href}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer block
        border border-[rgba(232,96,154,0.12)]
        transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:scale-[1.015] ${className}`}>
      <Image src={img} alt={label} fill
        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
      {/* Pink-tinted overlay matching brand */}
      <div className="absolute inset-0 bg-gradient-to-t
        from-[rgba(91,45,142,0.88)] via-[rgba(91,45,142,0.15)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <span className="font-cormorant text-white font-semibold block
          text-[1.5rem] lg:text-[1.8rem] leading-tight mb-1">{label}</span>
        <span className="text-white/60 text-[0.72rem]">{sub}</span>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full
        bg-white/15 backdrop-blur-sm flex items-center justify-center
        text-white transition-all duration-250
        group-hover:bg-[#E8609A] group-hover:text-white">
        <ChevronRight size={14} />
      </div>
    </Link>
  );
}
