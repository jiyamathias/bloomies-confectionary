import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#433075] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-cormorant text-[1.75rem] font-semibold mb-2">
              Bloomies<span className="text-[#E1D7F0]">.</span>
            </div>
            <p className="font-cormorant italic text-[#E1D7F0] text-[0.95rem] mb-4">
              &ldquo;Baked with love, for people with good taste.&rdquo;
            </p>
            <p className="text-[0.8rem] text-white/40 leading-relaxed">
              Premium cakes, pastries &amp; confections crafted with love in Port Harcourt, Rivers State.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-[0.72rem] tracking-[0.14em] uppercase text-white/40 mb-4">Menu</h4>
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
                    className="text-[0.82rem] text-white/45 hover:text-[#E1D7F0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.72rem] tracking-[0.14em] uppercase text-white/40 mb-4">Company</h4>
            <ul className="space-y-2.5 list-none">
              {[
                ['/about',   'Our Story'    ],
                ['/about',   'Reviews'      ],
                ['/gallery', 'Portfolio'    ],
                ['/policy',  'Our Policy'   ],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href}
                    className="text-[0.82rem] text-white/45 hover:text-[#E1D7F0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://wa.me/2348181154270" target="_blank" rel="noopener noreferrer"
                  className="text-[0.82rem] text-white/45 hover:text-[#E1D7F0] transition-colors">
                  Custom Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.72rem] tracking-[0.14em] uppercase text-white/40 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:08181154270"
                className="flex gap-2.5 text-[0.8rem] text-white/45 hover:text-[#E1D7F0] transition-colors">
                <Phone size={14} className="text-[#E1D7F0] shrink-0 mt-0.5" /> 08181154270
              </a>
              <a href="https://instagram.com/bloomies.ng" target="_blank" rel="noopener noreferrer"
                className="flex gap-2.5 text-[0.8rem] text-white/45 hover:text-[#E1D7F0] transition-colors">
                <Instagram size={14} className="text-[#E1D7F0] shrink-0 mt-0.5" /> @bloomies.ng
              </a>
              <div className="flex gap-2.5 text-[0.8rem] text-white/45">
                <MapPin size={14} className="text-[#E1D7F0] shrink-0 mt-0.5" />
                <span>No 33 Amadimati Street, Mgbuoba, Port Harcourt</span>
              </div>
              <div className="flex gap-2.5 text-[0.8rem] text-white/45">
                <Clock size={14} className="text-[#E1D7F0] shrink-0 mt-0.5" />
                <span>Mon – Sat · Closes 5 PM<br/><span className="text-white/30">Closed on Sundays</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-3">
          <p className="text-[0.74rem] text-white/20 text-center flex items-center gap-3 flex-wrap justify-center">
            <span>© {new Date().getFullYear()} Bloomies Confectioneries · Port Harcourt</span>
            <Link href="/policy" className="text-white/35 hover:text-[#E1D7F0] transition-colors underline-offset-2 hover:underline">
              Our Policy
            </Link>
          </p>
          <div className="flex gap-3">
            {[
              ['📸', 'https://instagram.com/bloomies.ng'],
              ['💬', 'https://wa.me/2348181154270'     ],
              ['📞', 'tel:08181154270'                  ],
            ].map(([icon, href]) => (
              <a key={href} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center
                  text-[0.85rem] hover:bg-[#A58CF4] transition-all duration-200">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
