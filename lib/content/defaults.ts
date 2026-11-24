// The original words, headings and photos for every page. The CMS stores only what the admin
// changes on top of these, so anything never edited keeps showing exactly this.
//
// Long text fields support simple formatting (see components/RichText.tsx):
//   a blank line starts a new paragraph, and a line starting with "- " becomes a bullet.

export const DEFAULT_CONTENT = {
  // ── Site-wide ─────────────────────────────────────────────────────────────
  site: {
    contact: {
      whatsapp: '2348181154270',
      phone: '08181154270',
      instagram: 'bloomies.ng',
      address: 'No 33 Amadimati Street, Port Harcourt',
      city: 'Port Harcourt',
      hours: 'Mon – Sat, till 5 PM',
      closed: 'Closed on Sundays',
    },
    nav: {
      treatsLabel: 'Our Treats',
      treats: [
        { label: 'Cakes',        sub: 'One layer · Custom designs' },
        { label: 'Pastries',     sub: 'Pies · Rolls · Cinnamon buns' },
        { label: 'Small Chops',  sub: 'Packages for every gathering' },
        { label: 'Daily Treats', sub: 'Banana bread · Slices · More' },
      ],
      eventsLabel: 'Events',
      galleryLabel: 'Gallery',
      aboutLabel: 'About',
      storyLabel: 'Our Story',
      storySub: 'Who we are & how we bake',
      policyLabel: 'Our Policy',
      policySub: 'Ordering, delivery & refunds',
      orderLabel: 'Order Now',
      merchLabel: 'BakersMerch',
      merchUrl: 'https://bakersmerch.com',
    },
    footer: {
      tagline: 'Baked with love, for people with good taste.',
      blurb: 'Cakes, pastries and small chops from Port Harcourt.',
    },
  },

  // ── Home ──────────────────────────────────────────────────────────────────
  home: {
    hero: {
      brand: 'Bloomies',
      headline: 'Baked with love,',
      highlight: 'for people with good taste.',
      primaryLabel: 'Order a Cake',
      secondaryLabel: 'See All Treats',
      badge: 'Same-day delivery available on select items',
      slides: [
        { left: '/images/hero/1.webp', right: '/images/hero/2.webp' },
        { left: '/images/hero/3.webp', right: '/images/hero/4.webp' },
        { left: '/images/hero/5.webp', right: '/images/hero/6.webp' },
        { left: '/images/hero/7.webp', right: '/images/hero/8.webp' },
      ],
    },
    categories: {
      title: 'Pick your treat',
      subtitle: 'Everything is baked fresh in our Port Harcourt kitchen. Tap a category to see prices and order.',
      cakes:   { label: 'Cakes',              sub: 'One layer · Custom designs',   image: '/images/cat-cakes.jpg' },
      pastries:{ label: 'Pastries',           sub: 'Pies · Rolls · Cinnamon buns', image: '/images/cat-pastries.jpg' },
      chops:   { label: 'Small Chops',        sub: 'Packages for every gathering', image: '/images/cat-smallchops.jpg' },
      daily:   { label: 'Daily Treats',       sub: 'Banana bread · Slices · More', image: '/images/cat-daily.jpg' },
      events:  { label: 'Corporate & Events', sub: 'Bulk orders · Treat boxes',    image: '/images/cat-events.jpg' },
      galleryLink: 'View full gallery',
    },
    bestSellers: {
      subtitle: 'The ones people keep coming back for.',
    },
    stats: {
      visible: true,
      items: [
        { value: '1,000+',      label: 'Satisfied Clients' },
        { value: '★ 5.0',       label: 'Google Rating' },
        { value: 'Same Day',    label: 'Delivery Available' },
        { value: 'Fresh Daily', label: 'Made Every Morning' },
      ],
    },
    reviews: {
      visible: true,
      title: 'What our customers say',
      items: [
        { quote: '"Her treats are the best… my gosh! I\'ve never tasted anything like it."', name: 'Adaeze O.', source: 'Google review' },
        { quote: '"Customer care is absolutely top notch. They communicated every step of the way."', name: 'Chioma B.', source: 'Google review' },
        { quote: '"Genuinely the best cakes and pastries I\'ve ever had. Won\'t be going anywhere else."', name: 'Emeka J.', source: 'Google review' },
        { quote: '"Always my go-to for pastries. The cinnamon rolls are absolutely to die for."', name: 'Fatima M.', source: 'Google review' },
      ],
    },
    platforms: {
      visible: true,
      intro: 'You can also order us on',
      items: [
        { name: 'Glovo',    url: '' },
        { name: 'Chowdeck', url: '' },
      ],
    },
    customCta: {
      visible: true,
      title: 'Got a cake idea in your head?',
      body: 'Send us a photo or describe it on WhatsApp: size, colours, theme, date. We\'ll tell you what\'s possible and give you a price before we start.',
      button: 'Plan a custom cake',
      message: 'Hi Bloomies, I\'d like to place a custom order!',
      image1: '/images/hero/3.webp',
      image2: '/images/hero/2.webp',
      image3: '/images/hero/8.webp',
    },
  },

  // ── Cakes ─────────────────────────────────────────────────────────────────
  cakes: {
    header: {
      title: 'Our Cakes',
      subtitle: 'Pick a cake, then choose the flavour, icing, colour and message. You\'ll see the price as you go.',
      tag: 'Same-day on one-layer cakes',
    },
    steps: {
      visible: true,
      step1: 'Pick your cake',
      step2: 'Customise it',
      step3: 'Add extras',
      step4: 'Place your order',
    },
    oneLayer: {
      title: 'One-layer cakes',
      subtitle: 'Order before 12 PM and we can deliver today.',
      tag: 'Same day',
    },
    celebration: {
      title: 'Celebration cakes',
      subtitle: 'Multi-layer cakes from 6″ to 12″. Choose the size, layers, flavours, colours and topper. These need a few days\' notice.',
    },
    cta: {
      visible: true,
      title: 'Don\'t see your design?',
      body: 'Send us a reference photo on WhatsApp and we\'ll quote you for it.',
      button: 'Chat with Us',
      message: 'Hi Bloomies, I\'d like a fully custom cake!',
    },
  },

  // ── Pastries ──────────────────────────────────────────────────────────────
  pastries: {
    header: {
      title: 'Pastries',
      subtitle: 'Meat pies, sausage rolls, cinnamon rolls and more, baked every morning. Popular ones sell out early.',
      tag: 'Some items same day',
    },
    cta: {
      visible: true,
      title: 'Ordering for a crowd?',
      body: 'Parties, offices, church events: tell us how many people and when, and we\'ll put together a bulk order.',
      button: 'Ask about bulk orders',
      message: 'Hi Bloomies, I\'d like a bulk pastry order!',
    },
  },

  // ── Small chops ───────────────────────────────────────────────────────────
  smallChops: {
    header: {
      title: 'Small Chops',
      subtitle: 'Platters for house parties, birthdays and big events. Pick a size and we\'ll confirm the mix with you.',
      tag: '',
    },
    platters: {
      title: 'Choose a platter size',
      items: [
        { name: 'Starter Platter', description: 'For small gatherings. A mix of puff-puff, samosa, spring rolls and more.', serves: '10–20 guests', badge: '', image: '/images/smallchops-starter.jpg' },
        { name: 'Premium Platter', description: 'For mid-size parties. Bigger portions and a wider mix.', serves: '30–50 guests', badge: 'Popular', image: '/images/smallchops-premium.jpg' },
        { name: 'Party Platter', description: 'For big celebrations. Enough for a full event table.', serves: '60–100 guests', badge: '', image: '/images/smallchops-party.jpg' },
      ],
    },
    packages: {
      title: 'More packages',
    },
    combo: {
      visible: true,
      title: 'Build your own mix',
      body: 'Want only samosas and spring rolls? Add a custom combo to your cart and tell us the mix and guest count when you check out.',
      button: 'Add custom combo',
    },
    catering: {
      visible: true,
      title: 'Catering an event?',
      body: 'Weddings, office events, big parties: message us with the date and guest count and we\'ll put together a quote.',
      button: 'Get a catering quote',
      message: 'Hi Bloomies, I\'d like to discuss small chops event catering!',
    },
  },

  // ── Daily treats ──────────────────────────────────────────────────────────
  dailyTreats: {
    header: {
      title: 'Daily Treats',
      subtitle: 'Cake slices, banana bread, cupcakes and other grab-and-go treats, made fresh each day.',
      tag: 'All items same day',
    },
  },

  // ── Events ────────────────────────────────────────────────────────────────
  events: {
    header: {
      title: 'Corporate & Events',
      subtitle: 'Treat boxes, breakfast boxes and small chops for offices, launches, weddings and parties.',
      tag: '',
    },
    panel: {
      title: 'Feeding a room full of people?',
      body: 'Tell us the date, how many guests and your budget. We\'ll suggest a package and deliver on the day.',
      button: 'Plan your event on WhatsApp',
      message: 'Hi Bloomies, I\'d like to discuss an event catering order!',
      options: [
        { text: 'Treat boxes for staff & clients' },
        { text: 'Office breakfast boxes' },
        { text: 'Small chops for events' },
        { text: 'Bulk & custom packages' },
      ],
    },
  },

  // ── Gallery ───────────────────────────────────────────────────────────────
  gallery: {
    header: {
      title: 'Our Gallery',
      subtitle: 'Cakes we\'ve made for birthdays, weddings and everything in between. See one you like? Tap it to ask for the same.',
      tag: '',
    },
    cards: {
      hoverLabel: 'Order one like this',
    },
    merch: {
      visible: true,
      title: 'Bake too? Visit BakersMerch',
      body: 'Baking tools, cake boxes, stands and accessories for home and professional bakers.',
      button: 'Go to BakersMerch ↗',
      url: 'https://bakersmerch.com',
    },
  },

  // ── About ─────────────────────────────────────────────────────────────────
  about: {
    header: {
      title: 'Our Story',
      subtitle: 'A Port Harcourt bakery making cakes, pastries and small chops for birthdays, offices and everyday cravings.',
      tag: '',
    },
    story: {
      title: 'Baked in Port Harcourt',
      body: 'Bloomies Confectioneries is a bakery in Port Harcourt. We make one-layer and celebration cakes, pastries, small chops and daily treats, and we deliver across the city.\n\nIt started in our founder\'s kitchen, and every order is still made with the same care.',
      image: '/images/hero-portrait.jpg',
      badgeValue: '5.0',
      badgeLabel: 'Google rating',
      button: 'Chat with us',
      message: 'Hi Bloomies! I\'d like to place an order.',
      reasons: [
        { title: 'Made fresh', text: 'Cakes are made to order and pastries are baked every morning.' },
        { title: 'Same-day delivery', text: 'Order one-layer cakes and daily treats before 12 PM and get them today.' },
        { title: 'We keep you posted', text: 'We confirm the details with you before we bake, and let you know when your order is on its way.' },
      ],
    },
    owner: {
      visible: true,
      title: 'The baker behind Bloomies',
      body: 'Bloomies is run by a baker who still checks every order before it leaves the kitchen.\n\nIf you have an idea, even a rough one, send it over. We\'ll tell you honestly what will work for your size and budget.',
      image: '/images/about-baker.jpg',
      badgeValue: '1,000+',
      badgeLabel: 'happy customers',
      tags: [
        { text: 'Custom cakes' },
        { text: 'Pastries' },
        { text: 'Small chops' },
        { text: 'Event orders' },
      ],
    },
    reviews: {
      visible: true,
      title: 'What customers say',
      items: [
        { quote: '"Her treats are the best… my gosh! I\'ve never tasted anything like it. Bloomies is on a completely different level."', name: 'Adaeze O.', source: 'Google review · Port Harcourt' },
        { quote: '"Customer care is absolutely top notch. They communicated every step of the way and delivered exactly what I wanted."', name: 'Chioma B.', source: 'Google review · Port Harcourt' },
        { quote: '"Excellent delivery service and genuinely the best cakes and pastries I\'ve ever had. I won\'t be going anywhere else!"', name: 'Emeka J.', source: 'Google review · Port Harcourt' },
        { quote: '"Always my go-to for pastries. The cinnamon rolls and meat pies are absolutely to die for. Highly recommend!"', name: 'Fatima M.', source: 'Google review · Port Harcourt' },
      ],
    },
  },

  // ── Policy ────────────────────────────────────────────────────────────────
  policy: {
    header: {
      title: 'Our Policy',
      subtitle: 'How ordering, payment, delivery, cancellations and your information work at Bloomies.',
      tag: '',
    },
    sections: {
      items: [
        {
          title: 'Availability & Opening Hours',
          body: 'Bloomies is open Monday through Saturday and closed on Sundays. Ready-to-go items such as cake slices, pastries and daily treats are generally available in-store during opening hours, while bigger and custom cakes are made strictly to order — please reach out in advance to confirm availability for your date.',
        },
        {
          title: 'Ordering & Payment',
          body: 'Orders are confirmed once full payment (or the agreed deposit for custom cakes) has been received. We accept the following payment methods:\n- Online on this website: card, bank transfer or USSD, processed by Flutterwave\n- Bank transfer\n\nYou can pay online for items with a fixed price and for cakes you build on our cakes page. You pay the price shown at checkout. Delivery fees are not included and are confirmed with you on WhatsApp.\n\nPrices marked “From”, custom designs, deluxe flavours and event orders are quoted on WhatsApp before you pay. Custom and bigger cakes ordered this way require a minimum deposit of 50% of the total cost to begin work, with the balance cleared before the cake leaves our kitchen.',
        },
        {
          title: 'Cake Customisation & Reference Photos',
          body: 'Every cake is made to order based on the flavour, colour, size and design details you select on our website. If you have a picture of a design you love, there\'s no need to upload anything here — simply attach it directly in the WhatsApp chat once you tap “Order via WhatsApp”. Our team will let you know if a design needs any adjustment for the size or flavour you\'ve chosen.',
        },
        {
          title: 'Delivery & Pickup',
          body: 'Same-day delivery is available on select one-layer cakes and daily treats when ordered before 12 PM. Bigger and custom cakes require advance notice — please share your event date as early as possible. Delivery fees depend on your location within or outside Port Harcourt and will be confirmed on WhatsApp before your order is finalised. Pickup is available during opening hours.',
        },
        {
          title: 'Cancellations & Refunds',
          body: 'Orders cancelled 72 hours or more before the delivery date may be eligible for a full refund. However, if we have already sourced or purchased specific items for your custom order, the refund will be less the cost of those items. This is because we often begin purchasing custom materials as soon as payment is confirmed.\n- For cancellations made less than 72 hours before the delivery date, we do not offer refunds. Instead, customers may reschedule their order to another date within 3 months of the original delivery date.\n- Same-day orders are non-refundable. Once a same-day order is confirmed, we begin production immediately, so refunds cannot be issued.',
        },
        {
          title: 'Freshness, Quality & Storage',
          body: 'Everything we make is baked fresh and is at its best within 24–48 hours of collection or delivery. Cakes and pastries are perishable — please refrigerate cream-based items and consume promptly. We carefully inspect every order before it leaves our kitchen, but we cannot be held responsible for changes in texture or appearance caused by delays, improper storage, or temperature exposure after the order has been received in good condition.',
        },
        {
          title: 'Your Privacy & Information',
          body: 'We only collect the information you choose to share with us — your name, phone number, delivery address, email and order details — to prepare, deliver and communicate with you about your order. WhatsApp conversations are stored within WhatsApp under Meta\'s own privacy terms. If you pay online, your payment is handled by Flutterwave: we never see or store your card details, and Flutterwave keeps a record of the payment and your order summary so we can match it to your order. We never sell your details, and we only use your contact information to follow up on orders or respond to enquiries you initiate.',
        },
      ],
    },
    contact: {
      title: 'Questions about any of this?',
      button: 'Chat with Us',
      message: 'Hi Bloomies, I have a question about your policy.',
      updated: 'Last updated November 2026 · Bloomies Confectioneries, Port Harcourt',
    },
  },
};

export type Content = typeof DEFAULT_CONTENT;
export type PageKey = keyof Content;
export type SectionKey<P extends PageKey> = keyof Content[P] & string;
