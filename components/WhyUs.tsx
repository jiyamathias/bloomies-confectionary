'use client'
import Image          from 'next/image'
import { useReveal } from './useReveal'
import { Eyebrow }   from './Eyebrow'
import { IMG }       from './images'

const FEATURES = [
  { icon:'⭐', title:'Exceptional Quality', desc:'Every item made from the finest ingredients. No shortcuts, no compromises — pure excellence.' },
  { icon:'🚀', title:'Fast Delivery',       desc:'Partnering with Glovo and Chowdeck to get your treats to you hot, fresh, and on time.' },
  { icon:'🌅', title:'Fresh Daily',         desc:'Everything baked fresh every morning. Open daily, closes 5 PM — freshness has a schedule.' },
  { icon:'💛', title:'Top-Notch Service',   desc:"From first order to delivery, we treat every customer like family. That's the Bloomies promise." },
  { icon:'🏆', title:'5-Star Rated',        desc:'A perfect 5.0 Google rating. Every review reflects our commitment to making you smile.' },
  { icon:'✨', title:'Custom Creations',    desc:'Special occasion? Bespoke cakes and platters tailored exactly to your vision and taste.' },
]

export default function WhyUs() {
  const ref = useReveal()

  return (
    <section ref={ref as React.RefObject<HTMLElement>} aria-label="Why choose Bloomies"
      className="relative overflow-hidden bg-cocoa py-[clamp(60px,8vw,110px)] px-[clamp(20px,4vw,48px)]">
      <div className="absolute -top-44 -right-44 w-[580px] h-[580px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(200,145,58,.08)_0%,transparent_70%)]" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-14">
          <div className="reveal">
            <Eyebrow light>Why Bloomies</Eyebrow>
            <h2 className="font-playfair font-extrabold text-cream leading-[1.08]" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
              The Bloomies<br /><em className="not-italic text-gold">Difference</em>
            </h2>
          </div>
          <p className="reveal delay-2 text-[15px] text-[rgba(230,192,106,.58)] leading-[1.78] lg:pt-3.5">
            We&apos;re not just another bakery. We&apos;re your go-to destination for moments that deserve to be celebrated — with treats that taste as good as they look.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FEATURES.map((f, i) => (
            <article key={f.title} className={`reveal delay-${i + 1} p-7 rounded-4xl bg-cream/[.04] border border-gold/10 transition-all duration-300 cursor-default hover:bg-cream/[.07] hover:border-gold/25 hover:-translate-y-1`}>
              <div className="w-[50px] h-[50px] rounded-[18px] bg-gold/12 border border-gold/24 flex items-center justify-center text-[22px] mb-4" aria-hidden="true">{f.icon}</div>
              <h3 className="font-playfair text-[17px] font-bold text-cream mb-2.5">{f.title}</h3>
              <p className="text-[12px] text-[rgba(230,192,106,.5)] leading-[1.72]">{f.desc}</p>
            </article>
          ))}
        </div>

        {/* Image strip */}
        {/* <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-12">
          {IMG.strip.map((img, i) => (
            <div key={i} className="relative h-[216px] rounded-4xl overflow-hidden">
              <Image src={img.src} alt={img.alt} fill sizes="(max-width:640px) 100vw, 34vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-cocoa/28" />
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
