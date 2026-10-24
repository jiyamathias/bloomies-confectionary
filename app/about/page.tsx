import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import SectionHeading from '@/components/SectionHeading';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { Star, Zap, ChefHat, MessageCircle } from 'lucide-react';

const REVIEWS = [
  { q: '"Her treats are the best… my gosh! I\'ve never tasted anything like it. Bloomies is on a completely different level."', name: 'Adaeze O.' },
  { q: '"Customer care is absolutely top notch. They communicated every step of the way and delivered exactly what I wanted."', name: 'Chioma B.' },
  { q: '"Excellent delivery service and genuinely the best cakes and pastries I\'ve ever had. I won\'t be going anywhere else!"', name: 'Emeka J.' },
  { q: '"Always my go-to for pastries. The cinnamon rolls and meat pies are absolutely to die for. Highly recommend!"', name: 'Fatima M.' },
];

const WHY = [
  { Icon: ChefHat,       title: 'Made fresh',          desc: 'Cakes are made to order and pastries are baked every morning.' },
  { Icon: Zap,           title: 'Same-day delivery',   desc: 'Order one-layer cakes and daily treats before 12 PM and get them today.' },
  { Icon: MessageCircle, title: 'We keep you posted',  desc: 'We confirm the details with you before we bake, and let you know when your order is on its way.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our Story"
        subtitle="A Port Harcourt bakery making cakes, pastries and small chops for birthdays, offices and everyday cravings."
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">
        {/* ── The bakery ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <Image
                src="/images/hero-portrait.jpg" alt="Cakes made by Bloomies"
                fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border
              border-[rgba(165,140,244,0.25)] rounded-2xl px-5 py-4
              shadow-[0_12px_32px_rgba(67,48,117,0.12)] text-center">
              <span className="font-luckiest tracking-[0.02em] text-[2rem] text-[#433075] block leading-none">
                5.0
              </span>
              <span className="flex justify-center gap-0.5 my-1" aria-hidden>
                {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#433075" className="text-[#433075]"/>)}
              </span>
              <span className="text-[0.72rem] text-[#5E5A7C]">Google rating</span>
            </div>
          </div>

          <div>
            <SectionHeading className="mb-5" title="Baked in Mgbuoba"/>
            <p className="text-[0.95rem] text-[#5E5A7C] leading-relaxed mb-4">
              Bloomies Confectioneries is a bakery on Amadimati Street in Mgbuoba, Port Harcourt. We make
              one-layer and celebration cakes, pastries, small chops and daily treats, and we deliver
              across the city.
            </p>
            <p className="text-[0.95rem] text-[#5E5A7C] leading-relaxed mb-8">
              It started in our founder&apos;s kitchen, and every order is still made with the same care.
            </p>

            <div className="space-y-5 mb-8">
              {WHY.map(w => (
                <div key={w.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#E2BBFA] flex items-center justify-center shrink-0">
                    <w.Icon size={18} className="text-[#433075]"/>
                  </div>
                  <div>
                    <h3 className="text-[0.95rem] font-semibold text-[#433075] mb-0.5">{w.title}</h3>
                    <p className="text-[0.88rem] text-[#5E5A7C] leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <WhatsAppBtn
              href="https://wa.me/2348181154270?text=Hi%20Bloomies!%20I%27d%20like%20to%20place%20an%20order."
              className="px-8 py-4 text-[0.88rem]">
              Chat with us
            </WhatsAppBtn>
          </div>
        </div>

        {/* ── The owner ──
            TODO: replace with the owner's real name, a short story in their own words, and their photo
            (about-baker.jpg is a placeholder image). */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div>
            <SectionHeading className="mb-5" title="The baker behind Bloomies"/>
            <p className="text-[0.95rem] text-[#5E5A7C] leading-relaxed mb-4">
              Bloomies is run by a baker who still checks every order before it leaves the kitchen.
            </p>
            <p className="text-[0.95rem] text-[#5E5A7C] leading-relaxed mb-8">
              If you have an idea, even a rough one, send it over. We&apos;ll tell you honestly what will
              work for your size and budget.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Custom cakes', 'Pastries', 'Small chops', 'Event orders'].map(tag => (
                <span key={tag} className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.3)]
                  text-[#433075] text-[0.8rem] font-medium px-4 py-2 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5]">
              <Image
                src="/images/about-baker.jpg" alt="The owner of Bloomies"
                fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#433075]
              rounded-2xl px-5 py-4 shadow-[0_12px_32px_rgba(67,48,117,0.2)] text-center">
              <span className="font-luckiest tracking-[0.02em] text-[1.6rem] text-white block leading-none">
                1,000+
              </span>
              <span className="text-[0.75rem] text-white/80">happy customers</span>
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div id="reviews" className="scroll-mt-24">
          <SectionHeading className="mb-8" title="What customers say"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REVIEWS.map((r, i) => (
              <figure key={i} className="bg-white rounded-2xl p-6 border border-[rgba(165,140,244,0.18)]">
                <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#433075" className="text-[#433075]"/>)}
                </div>
                <blockquote className="text-[0.95rem] text-[#433075] leading-[1.7] mb-4">{r.q}</blockquote>
                <figcaption>
                  <span className="text-[0.85rem] font-semibold text-[#433075] block">{r.name}</span>
                  <span className="text-[0.75rem] text-[#5E5A7C]">Google review · Port Harcourt</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
