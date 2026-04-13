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
  { icon: <Star size={18} className="text-[#9B7EC8]" />, title: 'Exceptionally Delicious', desc: 'Every recipe perfected through years of practice and genuine passion for baking.' },
  { icon: <Zap size={18} className="text-[#E8609A]" />, title: 'Fast & Reliable Delivery', desc: 'Same-day delivery on select items. We never keep you waiting longer than necessary.' },
  { icon: <Heart size={18} className="text-[#E8609A]" />, title: 'Warm Customer Experience', desc: 'We treat every customer like family. Your joy is always our greatest reward.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our"
        titleEm="Story"
        subtitle="Born from a love of baking, built on a promise of quality."
      />

      {/* About grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <Image
                src="/images/about-baker.jpg" alt="Our Baker"
                fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Float badge */}
            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border
              border-[rgba(232,96,154,0.2)] rounded-2xl p-4 sm:p-5
              shadow-[0_12px_32px_rgba(91,45,142,0.1)] text-center">
              <span className="font-cormorant text-[2rem] sm:text-[2.4rem] text-[#E8609A] font-semibold block leading-none">
                ★ 5.0
              </span>
              <span className="text-[0.7rem] text-[#7B5EA7]">Google Rating</span>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#E8609A] mb-4">
              <span className="w-7 h-px bg-[#E8609A]" /> About Bloomies
            </div>
            <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-normal text-[#5B2D8E] leading-[1.15] mb-5">
              Made with Love,<br />
              <em className="italic text-[#E8609A]">Delivered with Pride</em>
            </h2>
            <p className="text-[0.92rem] text-[#7B5EA7] leading-relaxed mb-4">
              Bloomies Confectioneries was founded on one simple belief — that every celebration deserves something
              extraordinary. Nestled in the heart of Mgbuoba, Port Harcourt, we&apos;ve been crafting memories through
              premium cakes, pastries, and sweet treats that tell your story.
            </p>
            <p className="text-[0.92rem] text-[#7B5EA7] leading-relaxed mb-8">
              From our founder&apos;s kitchen to becoming one of Port Harcourt&apos;s most loved confectioneries — every creation
              is still made with the same love, care, and quality that started it all.
            </p>

            <div className="space-y-5 mb-8">
              {WHY.map(w => (
                <div key={w.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#F0EBFF] border border-[rgba(232,96,154,0.2)]
                    flex items-center justify-center shrink-0">
                    {w.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.9rem] font-medium text-[#5B2D8E] mb-1">{w.title}</h4>
                    <p className="text-[0.8rem] text-[#7B5EA7] leading-relaxed">{w.desc}</p>
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

        {/* Reviews */}
        <div id="reviews">
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#E8609A] mb-3">
            <span className="w-7 h-px bg-[#E8609A]" /> What Clients Say
          </div>
          <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-normal text-[#5B2D8E] mb-8">
            Loved by <em className="italic text-[#E8609A]">Everyone</em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[rgba(232,96,154,0.15)]
                hover:border-[#E8DAFF] hover:shadow-[0_12px_30px_rgba(232,96,154,0.1)] transition-all duration-300">
                <div className="text-[#9B7EC8] text-[0.85rem] mb-3">★★★★★</div>
                <p className="font-cormorant italic text-[1.1rem] text-[#5B2D8E] leading-[1.7] mb-4">{r.q}</p>
                <div>
                  <span className="text-[0.82rem] font-semibold text-[#5B2D8E] block">{r.name}</span>
                  <span className="text-[0.72rem] text-[#7B5EA7]">Google Review · Port Harcourt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
