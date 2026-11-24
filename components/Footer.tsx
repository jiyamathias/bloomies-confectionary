'use client';
import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram, MessageCircle } from 'lucide-react';
import Smile from '@/components/Smile';
import { useContact, useSection, waLink } from '@/lib/content/store';

export default function Footer() {
  const c = useContact();
  const f = useSection('site', 'footer');
  const nav = useSection('site', 'nav');
  const ig = c.instagram.replace(/^@/, '');
  const igUrl = `https://instagram.com/${ig}`;
  const tel = `tel:${c.phone.replace(/[^\d+]/g, '')}`;
  return (
    <footer className="bg-[#433075] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="font-luckiest text-[1.6rem] tracking-[0.02em] leading-none mb-3">
              Bloomies<span className="text-[#E2BBFA]">.</span>
            </div>
            <Smile className="w-[70px] h-auto text-[#E2BBFA] mb-4" tongue="#A58CF4"/>
            <p className="text-[#E2BBFA] text-[0.92rem] font-medium mb-3">{f.tagline}</p>
            <p className="text-[0.85rem] text-white/70 leading-relaxed">{f.blurb}</p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Menu</h4>
            <ul className="space-y-0.5 list-none">
              {[
                ['/cakes',        nav.treats[0]?.label ?? 'Cakes'],
                ['/pastries',     nav.treats[1]?.label ?? 'Pastries'],
                ['/small-chops',  nav.treats[2]?.label ?? 'Small Chops'],
                ['/daily-treats', nav.treats[3]?.label ?? 'Daily Treats'],
                ['/events',       nav.eventsLabel],
                ['/gallery',      nav.galleryLabel],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}
                    className="inline-block py-2 text-[0.88rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Company</h4>
            <ul className="space-y-0.5 list-none">
              {[
                ['/about',   nav.storyLabel ],
                ['/about#reviews', 'Reviews' ],
                ['/gallery', 'Portfolio'    ],
                ['/policy',  nav.policyLabel],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href}
                    className="inline-block py-2 text-[0.88rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={waLink(c.whatsapp)} target="_blank" rel="noopener noreferrer"
                  className="inline-block py-2 text-[0.88rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                  Custom Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href={tel}
                className="flex gap-2.5 py-1 text-[0.85rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                <Phone size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" /> {c.phone}
              </a>
              {ig && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer"
                  className="flex gap-2.5 py-1 text-[0.85rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                  <Instagram size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" /> @{ig}
                </a>
              )}
              {c.address && (
                <div className="flex gap-2.5 text-[0.8rem] text-white/75">
                  <MapPin size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" />
                  <span>{c.address}</span>
                </div>
              )}
              <div className="flex gap-2.5 text-[0.8rem] text-white/75">
                <Clock size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" />
                <span>{c.hours}<br/><span className="text-white/60">{c.closed}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-3">
          <p className="text-[0.78rem] text-white/60 text-center flex items-center gap-3 flex-wrap justify-center">
            <span>© {new Date().getFullYear()} Bloomies Confectioneries · {c.city}</span>
            <Link href="/policy" className="text-white/75 hover:text-[#E2BBFA] transition-colors underline-offset-2 hover:underline">
              {nav.policyLabel}
            </Link>
          </p>
          <div className="flex gap-3">
            {([
              [Instagram,     igUrl,               'Instagram'],
              [MessageCircle, waLink(c.whatsapp),  'WhatsApp' ],
              [Phone,         tel,                 'Call us'  ],
            ] as const).filter(([, , label]) => label !== 'Instagram' || ig).map(([Icon, href, label]) => (
              <a key={href} href={href} aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.1] flex items-center justify-center
                  text-white hover:bg-[#E2BBFA] hover:text-[#433075] transition-colors duration-200">
                <Icon size={16}/>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
