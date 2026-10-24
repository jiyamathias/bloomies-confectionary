import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram, MessageCircle } from 'lucide-react';
import Smile from '@/components/Smile';

export default function Footer() {
  return (
    <footer className="bg-[#433075] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-luckiest text-[1.6rem] tracking-[0.02em] leading-none mb-3">
              Bloomies<span className="text-[#E2BBFA]">.</span>
            </div>
            <Smile className="w-[70px] h-auto text-[#E2BBFA] mb-4" tongue="#A58CF4"/>
            <p className="text-[#E2BBFA] text-[0.92rem] font-medium mb-3">
              Baked with love, for people with good taste.
            </p>
            <p className="text-[0.85rem] text-white/70 leading-relaxed">
              Cakes, pastries and small chops from Mgbuoba, Port Harcourt.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Menu</h4>
            <ul className="space-y-2.5 list-none">
              {[
                ['/cakes',        'Cakes'                ],
                ['/pastries',     'Pastries'             ],
                ['/small-chops',  'Small Chops'          ],
                ['/daily-treats', 'Daily Treats'         ],
                ['/events',       'Corporate & Events'   ],
                ['/gallery',      'Gallery'              ],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}
                    className="text-[0.82rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Company</h4>
            <ul className="space-y-2.5 list-none">
              {[
                ['/about',   'Our Story'    ],
                ['/about#reviews', 'Reviews' ],
                ['/gallery', 'Portfolio'    ],
                ['/policy',  'Our Policy'   ],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href}
                    className="text-[0.82rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://wa.me/2348181154270" target="_blank" rel="noopener noreferrer"
                  className="text-[0.82rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                  Custom Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.12em] uppercase text-white/60 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:08181154270"
                className="flex gap-2.5 text-[0.8rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                <Phone size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" /> 08181154270
              </a>
              <a href="https://instagram.com/bloomies.ng" target="_blank" rel="noopener noreferrer"
                className="flex gap-2.5 text-[0.8rem] text-white/75 hover:text-[#E2BBFA] transition-colors">
                <Instagram size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" /> @bloomies.ng
              </a>
              <div className="flex gap-2.5 text-[0.8rem] text-white/75">
                <MapPin size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" />
                <span>No 33 Amadimati Street, Mgbuoba, Port Harcourt</span>
              </div>
              <div className="flex gap-2.5 text-[0.8rem] text-white/75">
                <Clock size={14} className="text-[#E2BBFA] shrink-0 mt-0.5" />
                <span>Mon – Sat · Closes 5 PM<br/><span className="text-white/60">Closed on Sundays</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-3">
          <p className="text-[0.78rem] text-white/60 text-center flex items-center gap-3 flex-wrap justify-center">
            <span>© {new Date().getFullYear()} Bloomies Confectioneries · Port Harcourt</span>
            <Link href="/policy" className="text-white/75 hover:text-[#E2BBFA] transition-colors underline-offset-2 hover:underline">
              Our Policy
            </Link>
          </p>
          <div className="flex gap-3">
            {([
              [Instagram,     'https://instagram.com/bloomies.ng', 'Instagram'],
              [MessageCircle, 'https://wa.me/2348181154270',       'WhatsApp' ],
              [Phone,         'tel:08181154270',                   'Call us'  ],
            ] as const).map(([Icon, href, label]) => (
              <a key={href} href={href} aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.1] flex items-center justify-center
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
