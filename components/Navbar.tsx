'use client'
import { useState, useEffect, useCallback } from 'react'

const LINKS = [
  { label: 'Home',    href: '#home'    },
  { label: 'About',   href: '#about'   },
  { label: 'Menu',    href: '#menu'    },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Order',   href: '#order'   },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      const nav  = document.getElementById('bl-nav')
      const menu = document.getElementById('bl-mobile-menu')
      if (!nav?.contains(e.target as Node) && !menu?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <nav
        id="bl-nav"
        role="navigation"
        aria-label="Main navigation"
        className={[
          'fixed top-3.5 left-1/2 -translate-x-1/2 z-[100]',
          'w-[calc(100%-2rem)] max-w-[1200px]',
          'flex items-center justify-between px-5 py-3 rounded-full',
          'border backdrop-blur-2xl transition-all duration-500',
          scrolled
            ? 'bg-cream/[.97] border-gold/30 shadow-dark-lg'
            : 'bg-cream/[.62] border-gold/20 shadow-dark-md',
        ].join(' ')}
      >
        {/* Logo */}
        <a href="#home" aria-label="Bloomies Confectioneries home" className="flex flex-col leading-none no-underline group">
          <span className="font-playfair text-[20px] font-black text-cocoa group-hover:text-gold transition-colors duration-200">Bloomies</span>
          <span className="font-cormorant text-[10px] tracking-[.42em] uppercase text-gold">Confectioneries</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-0.5 list-none m-0 p-0" role="list">
          {LINKS.map(l => (
            <li key={l.label}>
              <a href={l.href} className="text-[12px] font-medium text-cocoa-2 no-underline px-3.5 py-2 rounded-full transition-all duration-200 hover:bg-gold/10 hover:text-gold block">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          {/* Desktop CTA */}
          <a
            href="#order"
            className="hidden md:block text-[11px] font-semibold tracking-[.05em] text-cream no-underline px-5 py-2.5 rounded-full bg-cocoa-gradient shadow-gold-sm transition-all duration-300 hover:bg-gold-gradient hover:text-dark hover:shadow-gold-md hover:-translate-y-px"
          >
            Order Now ✦
          </a>

          {/* Hamburger */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="bl-mobile-menu"
            onClick={() => setOpen(v => !v)}
            className={[
              'md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]',
              'rounded-xl border cursor-pointer bg-transparent transition-all duration-300',
              open ? 'bg-gold/15 border-gold/40' : 'bg-cocoa/[.06] border-cocoa/[.12]',
            ].join(' ')}
          >
            <span className={['block w-[18px] h-[2px] rounded-full transition-all duration-300', open ? 'bg-gold translate-y-[7px] rotate-45' : 'bg-cocoa'].join(' ')} />
            <span className={['block w-[18px] h-[2px] rounded-full transition-all duration-200', open ? 'opacity-0 scale-x-0 bg-gold' : 'bg-cocoa'].join(' ')} />
            <span className={['block w-[18px] h-[2px] rounded-full transition-all duration-300', open ? 'bg-gold -translate-y-[7px] -rotate-45' : 'bg-cocoa'].join(' ')} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="bl-mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          className="md:hidden fixed top-[76px] left-1/2 w-[calc(100%-2rem)] max-w-[480px] z-[99] animate-mob-slide bg-cream/[.98] backdrop-blur-2xl rounded-3xl border border-gold/25 shadow-dark-lg p-3 pb-4 flex flex-col gap-1"
        >
          {LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={close}
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-medium text-cocoa-2 no-underline transition-all duration-200 hover:bg-gold/10 hover:text-gold">
              <span>{l.label}</span>
              <span className="text-gold text-[13px] opacity-60">→</span>
            </a>
          ))}
          <div className="h-px bg-gold/15 my-1.5" />
          <a href="#order" onClick={close}
            className="flex items-center justify-center px-6 py-4 mt-1 rounded-2xl bg-gold-gradient text-dark text-[12px] font-bold tracking-[.06em] no-underline shadow-gold-md">
            Order Now ✦
          </a>
          <p className="text-center mt-2.5 text-[10px] text-cocoa-3/40 tracking-[.2em] uppercase">Open Daily · Closes 5 PM</p>
        </div>
      )}
    </>
  )
}
