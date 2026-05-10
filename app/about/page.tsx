import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { Star, Zap, Heart } from 'lucide-react';

const REVIEWS = [
  { q: '"Her treats are the best… my gosh! I\'ve never tasted anything like it. Bloomies is on a completely different level."', name: 'Adaeze O.' },
  { q: '"Customer care is absolutely top notch. They communicated every step of the way and delivered exactly what I wanted."', name: 'Chioma B.' },
  { q: '"Excellent delivery service and genuinely the best cakes and pastries I\'ve ever had. I won\'t be going anywhere else!"', name: 'Emeka J.' },
  { q: '"Always my go-to for pastries. The cinnamon rolls and meat pies are absolutely to die for. Highly recommend!"', name: 'Fatima M.' },
];

const WHY = [
  { icon: <Star size={18} className="text-[#A58CF4]" />, title: 'Exceptionally Delicious', desc: 'Every recipe perfected through years of practice and genuine passion for baking.' },
  { icon: <Zap size={18} className="text-[#A58CF4]" />, title: 'Fast & Reliable Delivery', desc: 'Same-day delivery on select items. We never keep you waiting longer than necessary.' },
  { icon: <Heart size={18} className="text-[#A58CF4]" />, title: 'Warm Customer Experience', desc: 'We treat every customer like family. Your joy is always our greatest reward.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our"
        titleEm="Story"
        subtitle="Born from a love of baking, built on a promise of quality."
      />

      {/* ── About Bloomies — image LEFT, text RIGHT ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">

          {/* Image left */}
          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <Image
                src="/images/about-baker.jpg" alt="Bloomies Bakery"
                fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border
              border-[rgba(165,140,244,0.2)] rounded-2xl p-4 sm:p-5
              shadow-[0_12px_32px_rgba(67,48,117,0.1)] text-center">
              <span className="font-cormorant text-[2rem] sm:text-[2.4rem] text-[#433075] font-semibold block leading-none">
                ★ 5.0
              </span>
              <span className="text-[0.7rem] text-[#6E6A8C]">Google Rating</span>
            </div>
          </div>

          {/* Text right */}
          <div>
            <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-4">
              <span className="w-7 h-px bg-[#A58CF4]" /> About Bloomies
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-normal text-[#433075] leading-[1.15] mb-5">
              Made with Love,<br />
              <em className="italic text-[#A58CF4]">Delivered with Pride</em>
            </h2>
            <p className="text-[0.92rem] text-[#6E6A8C] leading-relaxed mb-4">
              Bloomies Confectioneries was founded on one simple belief — that every celebration deserves something
              extraordinary. Nestled in the heart of Mgbuoba, Port Harcourt, we&apos;ve been crafting memories through
              premium cakes, pastries, and sweet treats that tell your story.
            </p>
            <p className="text-[0.92rem] text-[#6E6A8C] leading-relaxed mb-8">
              From our founder&apos;s kitchen to becoming one of Port Harcourt&apos;s most loved confectioneries — every creation
              is still made with the same love, care, and quality that started it all.
            </p>

            <div className="space-y-5 mb-8">
              {WHY.map(w => (
                <div key={w.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#F3F0FA] border border-[rgba(165,140,244,0.2)]
                    flex items-center justify-center shrink-0">
                    {w.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.9rem] font-medium text-[#433075] mb-1">{w.title}</h4>
                    <p className="text-[0.8rem] text-[#6E6A8C] leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <WhatsAppBtn
              href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
              className="px-8 py-4 text-[0.88rem]">
              Order Now
            </WhatsAppBtn>
          </div>
        </div>

        {/* ── About the Owner — text LEFT, image RIGHT (inverted) ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">

          {/* Text left */}
          <div>
            <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-4">
              <span className="w-7 h-px bg-[#A58CF4]" /> About the Owner
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-normal text-[#433075] leading-[1.15] mb-5">
              The Heart<br />
              <em className="italic text-[#A58CF4]">Behind Bloomies</em>
            </h2>
            <p className="text-[0.92rem] text-[#6E6A8C] leading-relaxed mb-4">
              Bloomies was born from a deep passion for the art of baking and an unwavering commitment to
              excellence. Our founder started with a vision — to create confections so good they would make
              people pause, smile, and come back for more.
            </p>
            <p className="text-[0.92rem] text-[#6E6A8C] leading-relaxed mb-8">
              Every cake designed, every pastry crafted, every box delivered carries the personal touch of
              someone who genuinely loves what they do. That love? You taste it in every bite.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Certified Baker', 'Custom Cake Artist', 'Event Specialist'].map(tag => (
                <span key={tag} className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.25)]
                  text-[#433075] text-[0.75rem] font-medium px-4 py-2 rounded-full">
                  ✦ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Image right */}
          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <Image
                src="/images/about-baker.jpg" alt="Bloomies Owner"
                fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(67,48,117,0.3)] to-transparent" />
            </div>
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#433075]
              rounded-2xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(67,48,117,0.2)] text-center">
              <span className="font-cormorant text-[1.5rem] text-white font-semibold block leading-none">
                1,000+
              </span>
              <span className="text-[0.7rem] text-[#E1D7F0]">Happy Clients</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews">
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A58CF4] mb-3">
            <span className="w-7 h-px bg-[#A58CF4]" /> What Clients Say
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-normal text-[#433075] mb-8">
            Loved by <em className="italic text-[#A58CF4]">Everyone</em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[rgba(165,140,244,0.15)]
                hover:border-[#E1D7F0] hover:shadow-[0_12px_30px_rgba(67,48,117,0.08)] transition-all duration-300">
                <div className="text-[#A58CF4] text-[0.85rem] mb-3">★★★★★</div>
                <p className="font-cormorant italic text-[1.1rem] text-[#433075] leading-[1.7] mb-4">{r.q}</p>
                <div>
                  <span className="text-[0.82rem] font-semibold text-[#433075] block">{r.name}</span>
                  <span className="text-[0.72rem] text-[#6E6A8C]">Google Review · Port Harcourt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
