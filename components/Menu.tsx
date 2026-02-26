'use client'
import { useState }  from 'react'
import Image          from 'next/image'
import { Eyebrow }   from './Eyebrow'
import { IMG }       from './images'

const WA = '2348181154270'
const CATS = ['All','Cakes','Pastries','Small Chops','Bread','Fries & Sides','Sweet Treats']

const ITEMS = [
  { id:1,  name:'Signature Celebration Cake', cat:'Cakes',        price:'₦8,000+',        tag:'Bestseller',    desc:'Layered perfection with premium buttercream, fresh fruits, and hand-crafted decorations.' },
  { id:2,  name:'Chocolate Drip Cake',        cat:'Cakes',        price:'₦7,500+',        tag:'Fan Favorite',  desc:'Rich dark chocolate sponge with silky ganache drip and golden drizzle.' },
  { id:3,  name:'Velvet Birthday Cake',       cat:'Cakes',        price:'₦6,500+',        tag:undefined,       desc:'Classic red or blue velvet sponge with luscious cream cheese frosting and elegant floral toppers.' },
  { id:4,  name:'Croissant Assortment',       cat:'Pastries',     price:'₦800–₦1,500',   tag:'Fresh Daily',   desc:'Buttery, flaky croissants — plain, chocolate-filled, or almond-glazed. Baked fresh every morning.' },
  { id:5,  name:'Danish Pastry Box',          cat:'Pastries',     price:'₦3,500',         tag:undefined,       desc:'Delicate Danish pastries — cinnamon swirls, fruit-topped, and cream-filled.' },
  { id:6,  name:'Small Chops Platter',        cat:'Small Chops',  price:'₦5,000–₦10,000', tag:'Events Special',desc:'Premium puff puff, samosa, spring rolls, mini pies, and chicken lollipops. Perfect for events.' },
  { id:7,  name:'Mini Spring Rolls',          cat:'Small Chops',  price:'₦2,000',         tag:undefined,       desc:'Crispy golden rolls filled with seasoned vegetables and chicken, served with dipping sauce.' },
  { id:8,  name:'Signature Banana Bread',     cat:'Bread',        price:'₦2,500',         tag:'Must Try',      desc:'Moist, dense, and packed with ripe banana flavour. Made with walnuts and a hint of cinnamon.' },
  { id:9,  name:'Cheese & Herb Bread',        cat:'Bread',        price:'₦2,000',         tag:undefined,       desc:'Freshly baked artisan bread infused with aged cheese and aromatic herbs.' },
  { id:10, name:'Seasoned Fries',             cat:'Fries & Sides',price:'₦1,500',         tag:undefined,       desc:'Crispy golden fries tossed in our secret seasoning blend. Served with garlic aioli or ketchup.' },
  { id:11, name:'Loaded Fries',               cat:'Fries & Sides',price:'₦2,500',         tag:'New',           desc:'Thick-cut fries topped with melted cheese sauce, jalapeños, crispy bacon bits, and sour cream.' },
  { id:12, name:'Cupcake Collection',         cat:'Sweet Treats', price:'₦800–₦1,200',   tag:'Bestseller',    desc:'Beautifully decorated cupcakes in vanilla bean, salted caramel, and strawberry dream.' },
  { id:13, name:"Macarons Box (6pcs)",        cat:'Sweet Treats', price:'₦3,500',         tag:undefined,       desc:'Delicate macarons — raspberry, pistachio, lemon, and rose.' },
  { id:14, name:'Chocolate Truffles',         cat:'Sweet Treats', price:'₦4,000',         tag:undefined,       desc:'Handcrafted truffles dusted in cocoa and edible gold. Gift-boxed on request.' },
]

interface CartItem { id: number; name: string; price: string; qty: number }

export default function Menu() {
  const [cat,    setCat]    = useState('All')
  const [cart,   setCart]   = useState<CartItem[]>([])
  const [drawer, setDrawer] = useState(false)

  const filtered = cat === 'All' ? ITEMS : ITEMS.filter(i => i.cat === cat)
  const totalQty = cart.reduce((s, c) => s + c.qty, 0)

  const addToCart = (item: typeof ITEMS[0]) =>
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id)
      return ex
        ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })

  const remove = (id: number) => setCart(prev => prev.filter(c => c.id !== id))

  const sendWA = () => {
    const lines = cart.map(c => `• ${c.name} x${c.qty} (${c.price})`).join('\n')
    const msg   = `Hello Bloomies! 🌸 I'd like to place an order:\n\n${lines}\n\nPlease confirm availability and total. Thank you!`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="menu" aria-label="Our menu" className="py-[clamp(60px,8vw,110px)] px-[clamp(20px,4vw,48px)] bg-gradient-to-b from-cream-2 to-cream">
      <div className="max-w-[1200px] mx-auto">

        <header className="text-center mb-12">
          <Eyebrow>Our Offerings</Eyebrow>
          <h2 className="font-playfair font-extrabold text-cocoa" style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}>
            The Bloomies <em className="not-italic text-gold">Menu</em>
          </h2>
          <p className="text-[15px] text-cocoa-2/70 leading-[1.78] mt-2.5">
            Every item crafted with care. Tap + to add to your order, then send via WhatsApp.
          </p>
        </header>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-11" role="group" aria-label="Filter by category">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={['px-5 py-2.5 text-[11px] font-semibold tracking-[.04em] rounded-full border cursor-pointer font-dm transition-all duration-300',
                cat === c ? 'bg-cocoa text-cream border-cocoa shadow-dark-md' : 'bg-cream text-cocoa-2 border-cream-3 shadow-dark-sm hover:border-gold/40 hover:text-gold'].join(' ')}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-5 list-none p-0 m-0" role="list">
          {filtered.map(item => {
            const img = IMG.menu[item.id - 1]
            return (
              <li key={item.id} className="bg-cream rounded-4xl overflow-hidden border border-gold/10 shadow-dark-sm flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(36,20,9,.13)]">
                <div className="relative h-[208px] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {item.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 text-[9px] font-bold tracking-[.12em] uppercase bg-gold-gradient text-dark rounded-full shadow-gold-sm">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-semibold tracking-[.18em] uppercase text-gold mb-1.5">{item.cat}</p>
                  <h3 className="font-playfair text-[18px] font-bold text-cocoa leading-[1.3] mb-2">{item.name}</h3>
                  <p className="text-[12px] text-cocoa-2/62 leading-[1.68] flex-1">{item.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gold/10">
                    <span className="font-playfair text-[18px] font-black text-gold">{item.price}</span>
                    <button onClick={() => addToCart(item)} aria-label={`Add ${item.name} to order`}
                      className="flex items-center gap-1.5 px-4 py-2 bg-cocoa-gradient text-cream text-[11px] font-semibold tracking-[.04em] rounded-full border-0 cursor-pointer font-dm shadow-dark-sm transition-all duration-300 hover:bg-gold-gradient hover:text-dark hover:shadow-gold-sm">
                      + Add
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Cart FAB */}
      {totalQty > 0 && (
        <button onClick={() => setDrawer(true)} aria-label={`View your order — ${totalQty} items`}
          className="fixed bottom-7 right-7 z-[200] flex items-center gap-3 px-6 py-4 bg-cocoa-gradient text-cream border-0 rounded-full shadow-[0_16px_48px_rgba(36,20,9,.35)] cursor-pointer text-[11px] font-bold tracking-[.06em] font-dm transition-all duration-300 hover:-translate-y-1">
          🛍 View Order ({totalQty})
        </button>
      )}

      {/* Drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-dark/55 z-[300] backdrop-blur-sm cursor-pointer" onClick={() => setDrawer(false)} aria-hidden="true" />
          <aside role="dialog" aria-label="Your order" className="fixed inset-y-0 right-0 z-[301] w-full max-w-[430px] bg-cream flex flex-col shadow-dark-lg rounded-l-5xl">
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-cream-3">
              <div>
                <h2 className="font-playfair text-[22px] font-bold text-cocoa">Your Order</h2>
                <p className="text-[10px] font-medium tracking-[.18em] uppercase text-cocoa-3 mt-0.5">Review &amp; Send via WhatsApp</p>
              </div>
              <button onClick={() => setDrawer(false)} aria-label="Close" className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-2 border-0 text-[15px] cursor-pointer text-cocoa-2 hover:bg-cream-3 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-3.5">
              {cart.length === 0
                ? <p className="text-center py-16 text-cocoa-3/40 text-[14px]">Your order is empty</p>
                : cart.map(c => (
                  <div key={c.id} className="flex items-start justify-between gap-3 py-4 border-b border-gold/10">
                    <div>
                      <p className="font-playfair text-[15px] font-bold text-cocoa">{c.name}</p>
                      <p className="text-[11px] text-cocoa-3 mt-0.5">{c.price} · Qty: {c.qty}</p>
                    </div>
                    <button onClick={() => remove(c.id)} aria-label={`Remove ${c.name}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-cream-2 border-0 text-[12px] cursor-pointer text-cocoa-3 hover:bg-rose hover:text-white transition-all flex-shrink-0 mt-0.5">✕</button>
                  </div>
                ))
              }
            </div>
            <div className="px-7 pt-4 pb-7 border-t border-cream-3">
              <p className="text-[11px] text-cocoa-3/60 leading-[1.65] mb-4">Your order will be sent to our WhatsApp. We&apos;ll confirm availability and total cost.</p>
              <button onClick={sendWA} disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-wa-gradient text-white border-0 text-[11px] font-bold tracking-[.06em] cursor-pointer font-dm rounded-full shadow-green-lg transition-all duration-300 disabled:opacity-40 hover:shadow-[0_12px_36px_rgba(37,211,102,.5)] hover:-translate-y-0.5">
                💬 Send Order on WhatsApp
              </button>
              <p className="text-center text-[10px] text-cocoa-3/40 mt-3">📍 No 33 Amadimati St, Mgbuoba, Port Harcourt</p>
            </div>
          </aside>
        </>
      )}
    </section>
  )
}
