import PageHeader from '@/components/PageHeader';
import { WhatsAppBtn } from '@/components/WhatsAppBtn';
import { Clock, MapPin } from 'lucide-react';

const SECTIONS: { letter: string; title: string; body: React.ReactNode }[] = [
  {
    letter: 'A',
    title: 'Ordering & Payment',
    body: (
      <>
        <p>
          Orders are confirmed once full payment (or the agreed deposit for custom cakes) has been received.
          We accept the following payment methods:
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-[#A58CF4]">
          <li>Bank transfer</li>
          <li>POS on pickup or delivery</li>
          <li>Cash on pickup</li>
        </ul>
        <p>
          Custom and bigger cakes require a minimum deposit of 50% of the total cost to begin work, with the
          balance cleared before the cake leaves our kitchen. Prices shown on the website are estimates —
          your final price is always confirmed on WhatsApp before we proceed.
        </p>
      </>
    ),
  },
  {
    letter: 'B',
    title: 'Cake Customisation & Reference Photos',
    body: (
      <p>
        Every cake is made to order based on the flavour, colour, size and design details you select on our
        website. If you have a picture of a design you love, there&apos;s no need to upload anything here —
        simply attach it directly in the WhatsApp chat once you tap &ldquo;Order via WhatsApp&rdquo;. Our team
        will let you know if a design needs any adjustment for the size or flavour you&apos;ve chosen.
      </p>
    ),
  },
  {
    letter: 'C',
    title: 'Delivery & Pickup',
    body: (
      <p>
        Same-day delivery is available on select one-layer cakes and daily treats when ordered before 12 PM.
        Bigger and custom cakes require advance notice — please share your event date as early as possible.
        Delivery fees depend on your location within or outside Port Harcourt and will be confirmed on
        WhatsApp before your order is finalised. Pickup is available from our Mgbuoba location during opening
        hours.
      </p>
    ),
  },
  {
    letter: 'D',
    title: 'Cancellations & Changes',
    body: (
      <p>
        We understand plans change. Orders cancelled more than 48 hours before the delivery or collection date
        receive a full refund of any deposit paid. Cancellations made within 48 hours of delivery attract a
        10% charge on the total order value to cover ingredients and preparation already underway. Same-day
        orders, once confirmed, cannot be cancelled or refunded.
      </p>
    ),
  },
  {
    letter: 'E',
    title: 'Freshness, Quality & Storage',
    body: (
      <p>
        Everything we make is baked fresh and is at its best within 24–48 hours of collection or delivery.
        Cakes and pastries are perishable — please refrigerate cream-based items and consume promptly. We
        carefully inspect every order before it leaves our kitchen, but we cannot be held responsible for
        changes in texture or appearance caused by delays, improper storage, or temperature exposure after the
        order has been received in good condition.
      </p>
    ),
  },
  {
    letter: 'F',
    title: 'Your Privacy & Information',
    body: (
      <p>
        We only collect the information you choose to share with us — your name, phone number, delivery
        address and order details — to prepare, deliver and communicate with you about your order. Since
        ordering happens over WhatsApp, your conversation history is stored within WhatsApp itself under
        Meta&apos;s own privacy terms, not on our servers. We never sell or share your details with third
        parties, and we only use your contact information to follow up on orders or respond to enquiries you
        initiate.
      </p>
    ),
  },
  {
    letter: 'G',
    title: 'Availability & Opening Hours',
    body: (
      <p>
        Bloomies is open Monday through Saturday and closed on Sundays. Ready-to-go items such as cake slices,
        pastries and daily treats are generally available in-store during opening hours, while bigger and
        custom cakes are made strictly to order — please reach out in advance to confirm availability for your
        date.
      </p>
    ),
  },
];

export default function PolicyPage() {
  return (
    <>
      <PageHeader
        title="Our"
        titleEm="Policy"
        subtitle="The terms, conditions and privacy practices that guide every order, delivery and conversation with Bloomies — written plainly, so you always know where you stand."
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="space-y-5">
          {SECTIONS.map(s => (
            <section key={s.letter}
              className="bg-white border border-[rgba(165,140,244,0.14)] rounded-2xl p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-9 h-9 rounded-full bg-[#F3F0FA] border border-[rgba(165,140,244,0.25)]
                  flex items-center justify-center font-cormorant text-[1.05rem] font-semibold text-[#433075]">
                  {s.letter}
                </span>
                <div className="min-w-0">
                  <h2 className="font-cormorant text-[1.35rem] font-semibold text-[#433075] mb-2 leading-tight">
                    {s.title}
                  </h2>
                  <div className="text-[0.86rem] text-[#6E6A8C] leading-relaxed space-y-3">
                    {s.body}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact / questions */}
        <div className="mt-8 bg-[#433075] rounded-2xl p-7 sm:p-9 text-center sm:text-left
          sm:flex sm:items-center sm:justify-between gap-6">
          <div className="mb-5 sm:mb-0">
            <h3 className="font-cormorant text-[1.4rem] text-white font-normal mb-2">
              Questions about any of this?
            </h3>
            <div className="space-y-1.5">
              <p className="text-white/55 text-[0.82rem] flex items-center gap-2 justify-center sm:justify-start">
                <Clock size={13}/> Mon – Sat, closes 5 PM · Closed Sundays
              </p>
              <p className="text-white/55 text-[0.82rem] flex items-center gap-2 justify-center sm:justify-start">
                <MapPin size={13}/> No 33 Amadimati Street, Mgbuoba, Port Harcourt
              </p>
            </div>
          </div>
          <WhatsAppBtn
            href="https://wa.me/2348181154270?text=Hi%20Bloomies%2C%20I%20have%20a%20question%20about%20your%20policy."
            className="px-7 py-3.5 text-[0.85rem] shrink-0">
            Chat with Us
          </WhatsAppBtn>
        </div>

        <p className="text-[0.7rem] text-[#6E6A8C]/50 text-center mt-6">
          Last updated June 2026 · Bloomies Confectioneries, Port Harcourt
        </p>
      </div>
    </>
  );
}
