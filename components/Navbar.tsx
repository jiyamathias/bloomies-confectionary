'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronRight, ChevronDown, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/lib/cart';

type NavLink  = { href: string; label: string; sub?: string };
type NavGroup = { label: string; items: NavLink[]; wide?: boolean };
type NavEntry = NavLink | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => 'items' in e;

// Grouped so the bar stays short: products in one dropdown, info pages in another.
const NAV: NavEntry[] = [
  {
    label: 'Our Treats',
    wide: true,
    items: [
      { href: '/cakes',        label: 'Cakes',        sub: 'One layer · Custom designs'   },
      { href: '/pastries',     label: 'Pastries',     sub: 'Pies · Rolls · Cinnamon buns' },
      { href: '/small-chops',  label: 'Small Chops',  sub: 'Packages for every gathering' },
      { href: '/daily-treats', label: 'Daily Treats', sub: 'Banana bread · Slices · More' },
    ],
  },
  { href: '/events',  label: 'Events'  },
  { href: '/gallery', label: 'Gallery' },
  {
    label: 'About',
    items: [
      { href: '/about',  label: 'Our Story',  sub: 'Who we are & how we bake'    },
      { href: '/policy', label: 'Our Policy', sub: 'Ordering, delivery & refunds' },
    ],
  },
];

// Mobile drawer: each dropdown becomes a section; plain links share an "Explore" section.
const MOBILE_SECTIONS = NAV.reduce<{ title: string; links: NavLink[] }[]>((out, e) => {
  if (isGroup(e)) return [...out, { title: e.label, links: e.items }];
  const explore = out.find(sec => sec.title === 'Explore');
  if (explore) explore.links.push(e);
  else out.push({ title: 'Explore', links: [e] });
  return out;
}, []);

const linkBase = `text-[0.78rem] tracking-[0.08em] transition-colors duration-200 relative
  after:absolute after:bottom-[-3px] after:left-0 after:w-full after:h-px
  after:bg-[#A58CF4] after:scale-x-0 after:transition-transform after:duration-200
  hover:after:scale-x-100`;
const linkState = (active: boolean) => active
  ? 'text-[#433075] font-semibold after:scale-x-100'
  : 'text-[#6E6A8C] hover:text-[#433075] font-normal';

export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const pathname   = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating pill: sits over the hero and page banners instead of spanning the full width */}
      <nav className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-50 flex justify-center pointer-events-none">
        <div className={`pointer-events-auto w-full max-w-6xl h-[60px] rounded-full
          flex items-center justify-between gap-4 pl-5 pr-2 sm:pl-6 sm:pr-2.5
          border transition-all duration-300
          ${scrolled
            ? 'bg-white/95 backdrop-blur-[20px] border-[rgba(67,48,117,0.12)] shadow-[0_10px_30px_rgba(43,33,71,0.16)]'
            : 'bg-white/85 backdrop-blur-[16px] border-white/60 shadow-[0_8px_28px_rgba(43,33,71,0.12)]'
          }`}>

          {/* Logo */}
          <Link href="/"
            className="font-luckiest leading-none shrink-0 transition-all duration-200
              hover:opacity-80 select-none pt-1"
            style={{ fontSize: '1.55rem', color: '#433075', letterSpacing: '0.02em' }}>
            Bloomies<span style={{ color: '#A58CF4' }}>.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-7 list-none">
            {NAV.map(entry => (
              <li key={entry.label}>
                {isGroup(entry)
                  ? <NavDropdown group={entry} pathname={pathname}/>
                  : <Link href={entry.href} className={`${linkBase} ${linkState(pathname === entry.href)}`}>
                      {entry.label}
                    </Link>}
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* BakersMerch CTA */}
            <a href="https://bakersmerch.com" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-[0.72rem] tracking-[0.06em]
                text-[#433075] font-semibold px-4 py-2.5 rounded-full
                border border-[rgba(67,48,117,0.25)]
                hover:bg-[#F3F0FA] transition-colors duration-200">
              BakersMerch <ArrowUpRight size={13}/>
            </a>

            {/* Order: goes to the menu, checkout happens in the cart */}
            <Link href="/#treats"
              className="hidden lg:inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.04em]
                bg-[#433075] text-white px-5 py-2.5 rounded-full font-medium
                hover:bg-[#5B3E8A] transition-colors duration-200">
              Order Now
            </Link>

            {/* Cart */}
            <button onClick={onCartOpen}
              className="relative flex items-center gap-1.5 bg-[#F3F0FA] border border-[rgba(165,140,244,0.2)]
                px-4 py-2.5 rounded-full text-[#433075] text-[0.78rem] font-medium
                hover:bg-[#E1D7F0] hover:border-[#A58CF4]/40 transition-all duration-200">
              <ShoppingBag size={15}/>
              <span className="hidden sm:inline font-medium">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#433075] text-white
                  rounded-full w-[18px] h-[18px] text-[0.6rem] font-bold
                  flex items-center justify-center shadow">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#433075] hover:bg-[#F3F0FA] transition-colors"
              onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu: card under the pill ── */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-[#2B2147]/35 backdrop-blur-sm transition-opacity duration-300
          ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}/>

        <div className={`absolute top-[80px] inset-x-3 sm:inset-x-6 max-h-[calc(100dvh-96px)]
          bg-white rounded-3xl shadow-[0_20px_50px_rgba(43,33,71,0.25)] flex flex-col overflow-hidden
          transition-all duration-300 ease-out origin-top
          ${mobileOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-[0.98]'}`}>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-3">
            {/* Same grouping as desktop, shown as labelled sections */}
            {MOBILE_SECTIONS.map(section => (
              <div key={section.title} className="mb-5">
                <p className="text-[0.65rem] tracking-[0.18em] uppercase text-[#6E6A8C]/60 px-2 mb-2">{section.title}</p>
                <ul className="space-y-1">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl
                          text-[0.9rem] font-medium transition-all
                          ${pathname === link.href
                            ? 'bg-[#433075] text-white'
                            : 'text-[#433075] hover:bg-[#F3F0FA]'}`}>
                        {link.label}
                        <ChevronRight size={15} className="opacity-40"/>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <ul className="space-y-1">
              {/* BakersMerch in mobile too */}
              <li>
                <a href="https://bakersmerch.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl
                    text-[0.9rem] font-semibold text-[#433075] hover:bg-[#F3F0FA] transition-all">
                  Shop BakersMerch
                  <ArrowUpRight size={15} className="opacity-50"/>
                </a>
              </li>
            </ul>
          </div>

          <div className="px-4 pb-5 border-t border-[rgba(165,140,244,0.15)] pt-4 space-y-3">
            <a href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full
                bg-[#25D366] text-white py-3.5 rounded-full text-[0.88rem] font-semibold">
              <WAIcon/> Order on WhatsApp
            </a>
            <div className="text-center space-y-1">
              <p className="text-[0.78rem] text-[#5E5A7C] flex items-center justify-center gap-1.5"><MapPin size={12}/> Mgbuoba, Port Harcourt</p>
              <p className="text-[0.78rem] text-[#5E5A7C] flex items-center justify-center gap-1.5"><Clock size={12}/> Mon – Sat, till 5 PM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef   = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const active = group.items.some(i => i.href === pathname);
  const panelId = `nav-${group.label.toLowerCase().replace(/\s+/g, '-')}`;

  const show = useCallback(() => { clearTimeout(closeTimer.current); setOpen(true); }, []);
  // Short delay so moving the mouse from the button to the panel doesn't close it.
  const hide = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative"
      onPointerEnter={e => e.pointerType === 'mouse' && show()}
      onPointerLeave={e => e.pointerType === 'mouse' && hide()}
      onBlur={e => { if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>

      <button ref={buttonRef} type="button"
        aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
        className={`${linkBase} ${linkState(active || open)} inline-flex items-center gap-1`}>
        {group.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
      </button>

      {/* pt-4 is an invisible bridge between button and panel so hover isn't lost */}
      <div id={panelId}
        className={`absolute left-1/2 top-full pt-6 -translate-x-1/2 transition-all duration-200
          ${open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-1 pointer-events-none'}`}>
        <ul className={`list-none bg-white rounded-2xl p-2 border border-[rgba(165,140,244,0.18)]
          shadow-[0_18px_48px_rgba(67,48,117,0.16)]
          ${group.wide ? 'grid grid-cols-2 gap-1 w-[460px]' : 'w-[260px] space-y-1'}`}>
          {group.items.map(item => {
            const current = item.href === pathname;
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={current ? 'page' : undefined}
                  className={`group block rounded-xl px-4 py-3 transition-colors duration-150
                    ${current ? 'bg-[#F3F0FA]' : 'hover:bg-[#F7F4FD] focus-visible:bg-[#F7F4FD]'}`}>
                  <span className="flex items-center justify-between text-[0.85rem] font-semibold text-[#433075]">
                    {item.label}
                    <ChevronRight size={14}
                      className="text-[#A58CF4] opacity-0 -translate-x-1 transition-all duration-150
                        group-hover:opacity-100 group-hover:translate-x-0"/>
                  </span>
                  {item.sub && (
                    <span className="block mt-0.5 text-[0.72rem] text-[#6E6A8C]">{item.sub}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
