'use client'
import Image          from 'next/image'
import { useReveal } from './useReveal'
import { Eyebrow }   from './Eyebrow'
import { IMG }       from './images'

const WA = '2348181154270'
const INFO = [
  { ico:'📍', lbl:'Location',  val:'No 33 Amadimati Street, Mgbuoba, Port Harcourt', href: undefined },
  { ico:'🕐', lbl:'Hours',     val:'Open Daily · Closes 5:00 PM',                   href: undefined },
  { ico:'📞', lbl:'Phone',     val:'08181154270',                                    href:'tel:08181154270' },
  { ico:'📸', lbl:'Instagram', val:'@bloomies.ng',                                  href:'https://instagram.com/bloomies.ng' },
]

export default function OrderSection() {
  const ref = useReveal()

  const openWA = () => {
    const msg = "Hello Bloomies! 🌸 I'd like to place an order. Could you please help me with your menu and availability? Thank you!"
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="order" ref={ref as React.RefObject<HTMLElement>} aria-label="Place your order"
      className="bg-gradient-to-b from-cream-2 to-cream py-[clamp(60px,8vw,110px)] px-[clamp(20px,4vw,48px)]">
      <div className="max-w-[1200px] mx-auto">

        <header className="reveal text-center mb-14">
          <Eyebrow>Place Your Order</Eyebrow>
          <h2 className="font-playfair font-extrabold text-cocoa" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
            Ready to <em className="not-italic text-gold">Indulge?</em>
          </h2>
          <p className="text-[15px] text-cocoa-2/70 leading-[1.78] mt-2.5 max-w-[520px] mx-auto">
            Order directly via WhatsApp for personal service, or find us on your favourite delivery platform.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Photo */}
          <div className="reveal relative">
            <div className="relative rounded-5xl overflow-hidden shadow-dark-lg" style={{ height: 'clamp(340px,40vw,520px)' }}>
              <Image src={IMG.order.src} alt={IMG.order.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/65 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                <p className="font-cormorant italic font-light text-cream leading-[1.5]" style={{ fontSize: 'clamp(17px,2.2vw,21px)' }}>
                  &ldquo;Every order is made with the same love as if it were for our own family.&rdquo;
                </p>
                <p className="text-[9px] font-semibold tracking-[.3em] uppercase text-gold-2 mt-3">— Bloomies Team</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="reveal delay-2 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-5xl bg-cocoa-gradient p-7 shadow-dark-lg">
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(200,145,58,.1)_0%,transparent_70%)]" aria-hidden="true" />
              <h3 className="font-playfair text-[23px] font-bold text-cream mb-2">Order via WhatsApp</h3>
              <p className="text-[13px] text-[rgba(230,192,106,.6)] leading-[1.72] mb-5">Chat directly — share your request, get a quote, and confirm delivery in minutes.</p>
              <button onClick={openWA}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-wa-gradient text-white border-0 text-[11px] font-bold tracking-[.06em] cursor-pointer font-dm rounded-full shadow-green-lg transition-all duration-300 hover:shadow-[0_12px_36px_rgba(37,211,102,.5)] hover:-translate-y-0.5">
                💬 Chat with Us on WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['Glovo','Chowdeck'].map(p => (
                <div key={p} className="bg-cream p-5 text-center rounded-4xl border border-cream-3 shadow-dark-sm transition-all duration-300 hover:border-gold hover:-translate-y-0.5 hover:shadow-dark-md">
                  <p className="font-playfair text-[18px] font-bold text-cocoa">{p}</p>
                  <p className="text-[9px] font-medium tracking-[.2em] uppercase text-cocoa-3 mt-1">Delivery App</p>
                  <span className="inline-block mt-3 px-3.5 py-1.5 bg-gold-3 border border-gold/30 rounded-full text-[9px] font-semibold text-gold tracking-[.1em] uppercase">Order Now</span>
                </div>
              ))}
            </div>

            <div className="bg-cream border border-cream-3 rounded-5xl p-5 flex flex-col gap-3.5 shadow-dark-sm">
              {INFO.map(row => (
                <div key={row.lbl} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-gold-3 flex items-center justify-center flex-shrink-0 text-[14px] mt-0.5" aria-hidden="true">{row.ico}</div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[.18em] uppercase text-cocoa-3 mb-0.5">{row.lbl}</p>
                    {row.href
                      ? <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="text-[13px] font-medium text-cocoa no-underline leading-[1.5] hover:text-gold transition-colors">{row.val}</a>
                      : <p className="text-[13px] font-medium text-cocoa leading-[1.5]">{row.val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-medium tracking-[.12em] uppercase text-cocoa-3/50">We accept:</span>
              {['💳 Transfer','💳 Debit Card'].map(b => (
                <span key={b} className="px-3.5 py-1.5 bg-cream-2 border border-cream-3 rounded-full text-[10px] font-medium text-cocoa-3">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
