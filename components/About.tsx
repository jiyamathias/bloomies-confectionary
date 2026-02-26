'use client'
import Image from 'next/image'
import { useReveal } from './useReveal'
import { Eyebrow }   from './Eyebrow'
import { IMG }       from './images'

const STATS = [
  { val: '5.0',    lbl: 'Star Rating'  },
  { val: '12+',    lbl: 'Reviews'      },
  { val: '100%',   lbl: 'Fresh Daily'  },
  { val: '₦1–10K', lbl: 'Price Range'  },
]

export default function About() {
  const ref = useReveal()

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-cream overflow-hidden py-[clamp(60px,8vw,110px)] px-[clamp(20px,4vw,48px)]"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,6vw,96px)] items-center">

        {/* Text */}
        <div>
          <div className="reveal"><Eyebrow>Our Story</Eyebrow></div>
          <h2 className="reveal delay-1 font-playfair font-extrabold text-cocoa leading-[1.05]" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
            Crafted with<br /><em className="not-italic text-gold">Love &amp; Passion</em>
          </h2>
          <p className="reveal delay-2 text-[15px] text-cocoa-2/70 leading-[1.8] mt-4">
            At Bloomies Confectioneries, we believe every celebration deserves something extraordinary.
            Nestled in the heart of Mgbuoba, Port Harcourt, we pour our hearts into every creation —
            from signature celebration cakes to freshly baked banana bread and premium small chops.
          </p>
          <p className="reveal delay-2 text-[15px] text-cocoa-2/70 leading-[1.8] mt-3">
            What makes us different? We don&apos;t just bake — we create memories. Our treats are made
            fresh daily and our warm customer service ensures every order arrives with a smile.
          </p>
          <div className="reveal delay-3 grid grid-cols-2 gap-3.5 mt-10">
            {STATS.map(s => (
              <div key={s.lbl} className="p-5 rounded-4xl bg-cream-2 border border-cream-3 transition-all duration-300 hover:bg-gold-3 hover:-translate-y-[3px] hover:shadow-dark-md">
                <p className="font-playfair text-[30px] font-black text-cocoa">{s.val}</p>
                <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-cocoa-3 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="reveal delay-2 relative">
          <div className="relative rounded-5xl overflow-hidden shadow-dark-lg" style={{ height: 'clamp(320px,45vw,580px)' }}>
            <Image
              src={IMG.about.src}
              alt={IMG.about.alt}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/45 to-transparent" />
          </div>

          {/* Float cards — hidden on small screens to avoid overflow */}
          <div className="hidden sm:block absolute -top-[26px] -right-[18px] bg-cream/95 backdrop-blur-2xl border border-gold/22 rounded-4xl shadow-dark-lg p-5 min-w-[148px] text-center">
            <p className="font-playfair text-[46px] font-black text-cocoa leading-none">5.0</p>
            <div className="flex gap-[3px] justify-center my-2" aria-hidden="true">
              {[...Array(5)].map((_, i) => <span key={i} className="text-gold text-[14px]">★</span>)}
            </div>
            <p className="text-[9px] font-semibold tracking-[.2em] uppercase text-cocoa-3">Google Rating</p>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -left-[18px] bg-cream/95 backdrop-blur-2xl border border-gold/22 rounded-4xl shadow-dark-lg p-5 min-w-[164px]">
            <p className="text-[10px] font-semibold tracking-[.15em] uppercase text-gold">Open Daily</p>
            <p className="font-playfair text-[20px] font-bold text-cocoa mt-1">Until 5 PM</p>
            <p className="text-[10px] text-cocoa-3 mt-0.5">Delivery &amp; Pickup</p>
          </div>
        </div>
      </div>
    </section>
  )
}
