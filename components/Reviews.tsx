'use client'
import { useReveal } from './useReveal'
import { Eyebrow }   from './Eyebrow'

const REVIEWS = [
  { name:'Adaeze O.',     init:'AO', color:'bg-gold',    text:"Her treats are the best... my gosh! I ordered a birthday cake and the whole family went crazy. Will order again and again!" },
  { name:'Chidinma E.',   init:'CE', color:'bg-rose',    text:"Customer care is top notch. She was patient with my custom order and the result was beyond what I imagined. Absolutely perfect." },
  { name:'Tobechukwu M.', init:'TM', color:'bg-cocoa-3', text:"Excellent delivery service and the best cakes and pastries ever. I've tried many bakeries in Port Harcourt — nothing comes close." },
  { name:'Ifunanya B.',   init:'IB', color:'bg-gold',    text:"Always my go-to for pastries. Whether it's a small order or a big event platter, the quality is consistently outstanding." },
  { name:'David A.',      init:'DA', color:'bg-rose',    text:"I ordered the small chops for my daughter's birthday. Every guest was asking for the caterer's contact — that's how good it was!" },
  { name:'Ngozi P.',      init:'NP', color:'bg-cocoa-3', text:"The banana bread alone is worth a special trip. Moist, perfectly sweet, and absolutely addictive. Bloomies never disappoints." },
]

export default function Reviews() {
  const ref = useReveal()
  return (
    <section id="reviews" ref={ref as React.RefObject<HTMLElement>} aria-label="Customer reviews"
      className="bg-cream py-[clamp(60px,8vw,110px)] px-[clamp(20px,4vw,48px)]">
      <div className="max-w-[1200px] mx-auto">
        <header className="reveal text-center mb-14">
          <Eyebrow>Customer Love</Eyebrow>
          <h2 className="font-playfair font-extrabold text-cocoa" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
            What People <em className="not-italic text-gold">Say</em>
          </h2>
          <div className="flex flex-col items-center mt-6">
            <p className="font-playfair text-[92px] font-black text-cocoa leading-none" aria-label="5.0 star rating">5.0</p>
            <div className="flex gap-2 my-2.5" aria-hidden="true">
              {[...Array(5)].map((_, i) => <span key={i} className="text-gold text-[26px]">★</span>)}
            </div>
            <p className="text-[10px] font-semibold tracking-[.22em] uppercase text-cocoa-3">Google Rating · 12 Reviews</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <blockquote key={r.name}
              className={`reveal delay-${i + 1} bg-cream-2 p-7 rounded-4xl border border-transparent flex flex-col shadow-dark-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(36,20,9,.1)] hover:border-gold/16`}>
              <p className="font-playfair text-[52px] text-gold/18 leading-[.8] mb-2.5 italic" aria-hidden="true">&ldquo;</p>
              <p className="text-[13px] text-cocoa-2/76 leading-[1.75] italic flex-1 mb-4">&ldquo;{r.text}&rdquo;</p>
              <footer className="flex items-center justify-between border-t border-gold/10 pt-3.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`} aria-hidden="true">{r.init}</div>
                  <div>
                    <cite className="not-italic text-[13px] font-semibold text-cocoa">{r.name}</cite>
                    <p className="text-[9px] font-medium tracking-[.12em] uppercase text-cocoa-3/50">Verified</p>
                  </div>
                </div>
                <div className="flex gap-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-gold text-[12px]">★</span>)}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="reveal text-center mt-14">
          <p className="text-[13px] text-cocoa-2/50 mb-4">See our latest creations on Instagram</p>
          <a href="https://instagram.com/bloomies.ng" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border-2 border-cocoa text-cocoa text-[11px] font-semibold tracking-[.06em] no-underline rounded-full transition-all duration-300 hover:bg-cocoa hover:text-cream">
            📸 @bloomies.ng
          </a>
        </div>
      </div>
    </section>
  )
}
