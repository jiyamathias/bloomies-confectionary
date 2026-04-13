'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart';

const NAV_LINKS = [
  { href: '/cakes',        label: 'Cakes'        },
  { href: '/pastries',     label: 'Pastries'     },
  { href: '/small-chops',  label: 'Small Chops'  },
  { href: '/daily-treats', label: 'Daily Treats' },
  { href: '/events',       label: 'Events'       },
  { href: '/gallery',      label: 'Gallery'      },
  { href: '/about',        label: 'About'        },
];

export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        bg-[rgba(250,248,255,0.95)] backdrop-blur-[16px]
        border-b border-[rgba(232,96,154,0.15)]
        ${scrolled ? 'shadow-[0_4px_30px_rgba(91,45,142,0.08)]' : ''}`}>

        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-cormorant text-[1.7rem] font-semibold text-[#5B2D8E]
            tracking-wide shrink-0 hover:text-[#E8609A] transition-colors">
            Bloomies<span className="text-[#E8609A]">.</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex gap-7 list-none">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className={`text-[0.75rem] tracking-[0.1em] uppercase transition-colors duration-200
                    ${pathname === link.href
                      ? 'text-[#E8609A] font-medium'
                      : 'text-[#7B5EA7] hover:text-[#E8609A]'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* WhatsApp — hidden on mobile */}
            <a href="https://wa.me/2348181154270" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-[0.75rem] tracking-[0.08em]
                border-2 border-[#E8609A] text-[#E8609A] px-5 py-2 rounded-full
                hover:bg-[#E8609A] hover:text-white transition-all duration-250">
              Order via WhatsApp
            </a>

            {/* Cart */}
            <button onClick={onCartOpen}
              className="flex items-center gap-2 bg-[#F0EBFF] border border-[rgba(155,111,186,0.25)]
                px-4 py-2 rounded-full text-[#E8609A] text-[0.78rem] font-medium
                hover:bg-[#E8DAFF] transition-all duration-200">
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="bg-[#E8609A] text-white rounded-full w-[18px] h-[18px]
                  text-[0.62rem] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button className="lg:hidden p-2 text-[#5B2D8E]"
              onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300
        ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)} />

        <div className={`absolute top-0 right-0 bottom-0 w-[300px] bg-[#FAFAFE]
          shadow-2xl transition-transform duration-400 ease-out flex flex-col pt-[68px]
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="text-[0.67rem] tracking-[0.18em] uppercase text-[#7B5EA7]/50 mb-4">Menu</p>
            <ul className="space-y-1">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-xl
                      text-[0.92rem] font-medium transition-all duration-200
                      ${pathname === link.href
                        ? 'bg-[#E8609A] text-white'
                        : 'text-[#5B2D8E] hover:bg-[#E8DAFF]'}`}>
                    {link.label}
                    <ChevronRight size={16} className="opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-[rgba(232,96,154,0.15)] pt-6 space-y-3">
              <a href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366]
                  text-white py-3.5 rounded-full text-[0.88rem] font-semibold">
                <WAIcon /> Chat on WhatsApp
              </a>
              <div className="text-center space-y-1">
                <p className="text-[0.75rem] text-[#7B5EA7]">📍 Mgbuoba, Port Harcourt</p>
                <p className="text-[0.75rem] text-[#7B5EA7]">🕐 Open daily · Closes 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[68px]" />
    </>
  );
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
