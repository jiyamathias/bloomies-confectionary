const LINKS = [
  { href:'#home',    label:'Home'     },
  { href:'#about',   label:'About'    },
  { href:'#menu',    label:'Menu'     },
  { href:'#reviews', label:'Reviews'  },
  { href:'#order',   label:'Order Now'},
]
const CONTACT = [
  { ico:'📞', text:'08181154270',      href:'tel:08181154270'                    },
  { ico:'📸', text:'@bloomies.ng',     href:'https://instagram.com/bloomies.ng' },
  { ico:'📍', text:'No 33 Amadimati Street,\nMgbuoba, Port Harcourt 500272', href: undefined },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-cream py-[clamp(48px,6vw,72px)] px-[clamp(20px,4vw,48px)] pb-9">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 md:gap-14 pb-12 border-b border-gold/10 mb-7">
          <div>
            <p className="font-playfair text-[29px] font-black">Bloomies</p>
            <p className="font-cormorant text-[11px] tracking-[.38em] uppercase text-gold italic mb-3.5">Confectioneries</p>
            <p className="text-[12px] text-[rgba(230,192,106,.42)] leading-[1.85] max-w-[258px]">
              Premium cakes, pastries &amp; irresistible treats — crafted with love in Port Harcourt, Nigeria.
            </p>
            <div className="flex items-center gap-1 mt-4" aria-label="5 star rating">
              {[...Array(5)].map((_, i) => <span key={i} aria-hidden="true" className="text-gold text-[14px]">★</span>)}
              <span className="text-[10px] text-[rgba(230,192,106,.32)] ml-1.5">5.0 Rating</span>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-[9px] font-semibold tracking-[.38em] uppercase text-gold mb-4">Quick Links</p>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {LINKS.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] text-[rgba(230,192,106,.48)] no-underline transition-colors hover:text-gold">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[9px] font-semibold tracking-[.38em] uppercase text-gold mb-4">Get In Touch</p>
            <ul className="flex flex-col gap-3.5 list-none m-0 p-0">
              {CONTACT.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-[30px] h-[30px] rounded-[10px] bg-gold/12 flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5" aria-hidden="true">{item.ico}</div>
                  {item.href
                    ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[12px] text-[rgba(230,192,106,.46)] leading-[1.6] no-underline hover:text-gold transition-colors">{item.text}</a>
                    : <p className="text-[12px] text-[rgba(230,192,106,.46)] leading-[1.6] whitespace-pre-line">{item.text}</p>
                  }
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4">
              {['Glovo','Chowdeck'].map(p => (
                <span key={p} className="px-3.5 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-medium text-[rgba(230,192,106,.58)]">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-[11px] text-[rgba(230,192,106,.2)]">© {new Date().getFullYear()} Bloomies Confectioneries. All rights reserved.</p>
          <p className="text-[11px] text-[rgba(230,192,106,.2)]">Open Daily · Closes 5 PM · Port Harcourt</p>
        </div>
      </div>
    </footer>
  )
}
