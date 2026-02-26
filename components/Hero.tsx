import Image from 'next/image'
import { IMG } from './images'

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Welcome to Bloomies Confectioneries"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
    >
      {/* ── Layer 1: Mosaic background photos ── */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-40" aria-hidden="true">
        {IMG.hero.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width:768px) 50vw, 34vw"
              className="object-cover"
              priority={i < 3}
            />
          </div>
        ))}
      </div>

      {/* ── Layer 2: Gradient vignettes ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(18,10,3,.92)_0%,rgba(18,10,3,.45)_55%,transparent_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_100%,rgba(18,10,3,.96)_0%,rgba(18,10,3,.55)_50%,transparent_100%)]" aria-hidden="true" />

      {/* ── Layer 3: Central gold orb — FIX: use inset-0+m-auto instead of
           top-1/2 left-1/2 to avoid conflict with orbPulse's transform ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 m-auto w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,145,58,.13) 0%, transparent 70%)',
          animation: 'orbPulse 4.5s ease-in-out infinite',
        }}
      />

      {/* ── Layer 4: Content ── */}
      <div className="relative z-10 text-center px-6 max-w-[900px] w-full">

        {/* Star badge */}
        <div className="fu-1 inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-7"
          style={{ background: 'rgba(200,145,58,.14)', border: '1px solid rgba(200,145,58,.3)' }}>
          <div className="flex gap-0.5" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} aria-hidden="true" className="text-gold text-[12px]">★</span>
            ))}
          </div>
          <span className="text-[11px] font-medium tracking-[.07em]"
            style={{ color: 'rgba(230,192,106,.85)' }}>
            5.0 · Best in Port Harcourt
          </span>
        </div>

        {/* Headline */}
        <h1
          className="fu-2 font-playfair font-black text-cream mb-5"
          style={{ fontSize: 'clamp(48px,8.5vw,106px)', lineHeight: 0.92, }}
        >
          Where Every<br />
            <span className="shimmer-text" style={{animation: 'shimmer 4s linear infinite;'}}>Bite Blooms</span>

          <br />Into Joy
        </h1>

        <p
          className="fu-3 font-cormorant italic font-light mb-2.5"
          style={{ fontSize: 'clamp(18px,2.8vw,28px)', color: 'rgba(230,192,106,.72)' }}
        >
          Premium cakes, pastries &amp; irresistible treats
        </p>

        <p className="fu-4 text-[10px] tracking-[.34em] uppercase text-cream/30 mb-12">
          No 33 Amadimati Street, Mgbuoba · Port Harcourt
        </p>

        {/* CTAs */}
        <div className="fu-5 flex gap-3.5 items-center justify-center flex-wrap mb-10">
          <a
            href="#order"
            className="px-11 py-[17px] rounded-full text-dark text-[12px] font-bold tracking-[.06em] no-underline transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg,#c8913a,#e6c06a)',
              boxShadow: '0 12px 48px rgba(200,145,58,.45)',
            }}
          >
            Order Now →
          </a>
          <a
            href="#menu"
            className="px-10 py-4 rounded-full text-cream text-[12px] font-medium tracking-[.05em] no-underline backdrop-blur-md transition-all duration-300 hover:text-gold-2"
            style={{
              background: 'rgba(253,248,242,.09)',
              border: '1px solid rgba(253,248,242,.25)',
            }}
          >
            View Menu
          </a>
        </div>

        {/* Platform chips */}
        <div className="fu-6 flex items-center justify-center gap-2.5">
          <span className="text-[10px] tracking-[.22em] uppercase text-cream/28">Available on</span>
          {['Glovo', 'Chowdeck'].map(p => (
            <span
              key={p}
              className="px-4 py-1.5 text-[10px] font-medium tracking-[.09em] rounded-full"
              style={{ color: 'rgba(230,192,106,.7)', background: 'rgba(200,145,58,.1)', border: '1px solid rgba(200,145,58,.2)' }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-1.5 text-[9px] tracking-[.35em] uppercase"
        style={{ animation: 'bobble 2.3s ease-in-out infinite', color: 'rgba(200,145,58,.7)' }}
        aria-hidden="true"
      >
        <span>Scroll</span><span>↓</span>
      </div>
    </section>
  )
}
