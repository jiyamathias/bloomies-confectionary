// Describes every editable section so the admin editor can draw its forms automatically.
// Keys must match DEFAULT_CONTENT (lib/content/defaults.ts).
import type { PageKey } from '@/lib/content/defaults';

export type Field =
  | { type: 'text'; key: string; label: string; max?: number; help?: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; rows?: number; max?: number; help?: string; rich?: boolean }
  | { type: 'image'; key: string; label: string; help?: string }
  | { type: 'url'; key: string; label: string; help?: string; placeholder?: string }
  | { type: 'group'; key: string; label: string; fields: Field[] }
  | { type: 'list'; key: string; label: string; itemLabel: string; titleKey: string; fields: Field[];
      newItem: Record<string, string>; min?: number; max?: number; help?: string };

export interface SectionDef {
  id: string;
  label: string;
  description?: string;
  /** Section has a "visible" switch (show/hide on the site). */
  toggle?: boolean;
  fields: Field[];
  /** Extra note shown at the top of the section (e.g. where else related things are managed). */
  note?: { text: string; href?: string; linkLabel?: string };
}

export interface PageDef {
  id: PageKey;
  label: string;
  /** Page to load in the live preview. */
  path: string;
  description: string;
  sections: SectionDef[];
}

// ── small helpers to keep the definitions readable ──
const text = (key: string, label: string, o: Partial<Extract<Field, { type: 'text' }>> = {}): Field => ({ type: 'text', key, label, ...o });
const area = (key: string, label: string, o: Partial<Extract<Field, { type: 'textarea' }>> = {}): Field => ({ type: 'textarea', key, label, ...o });
const image = (key: string, label: string, help?: string): Field => ({ type: 'image', key, label, help });
const RICH_HELP = 'Leave a blank line to start a new paragraph. Start a line with "- " to make a bullet point.';
const MESSAGE = (label = 'WhatsApp message') =>
  area('message', label, { rows: 2, help: 'Pre-filled text when someone taps the button. They can edit it before sending.' });

const header = (description = 'The lilac banner at the top of the page.'): SectionDef => ({
  id: 'header', label: 'Page banner', description,
  fields: [
    text('title', 'Page title', { max: 40 }),
    area('subtitle', 'Intro text', { rows: 3, max: 220 }),
    text('tag', 'Badge (optional)', { max: 40, help: 'Small white badge on the right, e.g. "Same day". Leave empty to hide it.' }),
  ],
});

const ctaPanel = (label: string, description: string, withMessage = true): SectionDef => ({
  id: 'cta', label, description, toggle: true,
  fields: [
    text('title', 'Heading', { max: 60 }),
    area('body', 'Text', { rows: 3, max: 240 }),
    text('button', 'Button label', { max: 32 }),
    ...(withMessage ? [MESSAGE()] : []),
  ],
});

export const PAGES: PageDef[] = [
  {
    id: 'site', label: 'Site-wide', path: '/', description: 'Contact details, menu and footer. Used on every page.',
    sections: [
      {
        id: 'contact', label: 'Contact details & hours',
        description: 'Changing these updates every WhatsApp button, the footer, the policy page and the menu.',
        fields: [
          text('whatsapp', 'WhatsApp number', { help: 'International format without +, e.g. 2348181154270.', max: 15 }),
          text('phone', 'Phone number (shown)', { max: 20 }),
          text('instagram', 'Instagram handle', { help: 'Without the @.', max: 30 }),
          text('address', 'Address', { max: 80 }),
          text('city', 'City', { max: 40 }),
          text('hours', 'Opening hours', { max: 40, help: 'e.g. "Mon – Sat, till 5 PM".' }),
          text('closed', 'Closed days', { max: 40 }),
        ],
      },
      {
        id: 'nav', label: 'Top menu', description: 'Labels in the navigation bar and its dropdowns.',
        fields: [
          text('treatsLabel', 'Treats menu label', { max: 20 }),
          { type: 'list', key: 'treats', label: 'Treats dropdown', itemLabel: 'Menu item', titleKey: 'label', min: 4, max: 4,
            help: 'In order: Cakes, Pastries, Small Chops, Daily Treats.',
            fields: [text('label', 'Label', { max: 24 }), text('sub', 'Description', { max: 40 })], newItem: { label: '', sub: '' } },
          text('eventsLabel', 'Events link', { max: 20 }),
          text('galleryLabel', 'Gallery link', { max: 20 }),
          text('aboutLabel', 'About menu label', { max: 20 }),
          text('storyLabel', 'Our Story label', { max: 24 }),
          text('storySub', 'Our Story description', { max: 40 }),
          text('policyLabel', 'Policy label', { max: 24 }),
          text('policySub', 'Policy description', { max: 40 }),
          text('orderLabel', 'Order button', { max: 16 }),
          text('merchLabel', 'BakersMerch button', { max: 20 }),
          { type: 'url', key: 'merchUrl', label: 'BakersMerch link' },
        ],
      },
      {
        id: 'footer', label: 'Footer', description: 'The purple section at the bottom of every page.',
        fields: [text('tagline', 'Tagline', { max: 80 }), area('blurb', 'Short description', { rows: 2, max: 140 })],
      },
    ],
  },
  {
    id: 'home', label: 'Home', path: '/', description: 'Your front page.',
    sections: [
      {
        id: 'hero', label: 'Hero', description: 'The big photo section at the top.',
        fields: [
          text('brand', 'Big title', { max: 20 }),
          text('headline', 'Headline (white part)', { max: 40 }),
          text('highlight', 'Headline (lilac part)', { max: 50 }),
          text('primaryLabel', 'Main button', { max: 24 }),
          text('secondaryLabel', 'Second button', { max: 24 }),
          text('badge', 'Small note under the buttons', { max: 60, help: 'Leave empty to hide it.' }),
          { type: 'list', key: 'slides', label: 'Background photos', itemLabel: 'Slide', titleKey: '', min: 1, max: 8,
            help: 'Each slide shows two photos side by side (on phones, one above the other). Slides change every few seconds.',
            fields: [image('left', 'Left / top photo'), image('right', 'Right / bottom photo')],
            newItem: { left: '/images/hero/1.webp', right: '/images/hero/2.webp' } },
        ],
      },
      {
        id: 'categories', label: 'Pick your treat', description: 'The five category tiles.',
        fields: [
          text('title', 'Section title', { max: 40 }),
          area('subtitle', 'Intro text', { rows: 2, max: 160 }),
          ...([['cakes', 'Cakes tile'], ['pastries', 'Pastries tile'], ['chops', 'Small Chops tile'], ['daily', 'Daily Treats tile'], ['events', 'Events tile']] as const)
            .map(([key, label]) => ({ type: 'group', key, label, fields: [text('label', 'Title', { max: 24 }), text('sub', 'Subtitle', { max: 40 }), image('image', 'Photo')] }) as Field),
          text('galleryLink', 'Gallery link text', { max: 30 }),
        ],
      },
      {
        id: 'bestSellers', label: 'Best sellers', description: 'Product highlights.',
        note: { text: 'The section title and which products appear are set on the Best Sellers page.', href: '/admin/best-sellers', linkLabel: 'Open Best Sellers' },
        fields: [area('subtitle', 'Intro text', { rows: 2, max: 140 })],
      },
      {
        id: 'stats', label: 'Numbers strip', description: 'Four big numbers under the best sellers.', toggle: true,
        fields: [{ type: 'list', key: 'items', label: 'Numbers', itemLabel: 'Number', titleKey: 'value', min: 2, max: 4,
          fields: [text('value', 'Big text', { max: 14 }), text('label', 'Label', { max: 28 })], newItem: { value: '', label: '' } }],
      },
      {
        id: 'reviews', label: 'Customer reviews', toggle: true,
        fields: [
          text('title', 'Section title', { max: 40 }),
          { type: 'list', key: 'items', label: 'Reviews', itemLabel: 'Review', titleKey: 'name', min: 1, max: 8,
            fields: [area('quote', 'Review', { rows: 3, max: 220 }), text('name', 'Name', { max: 30 }), text('source', 'Source', { max: 40 })],
            newItem: { quote: '', name: '', source: 'Google review' } },
        ],
      },
      {
        id: 'platforms', label: 'Delivery apps strip', description: 'Where else people can order you.', toggle: true,
        fields: [
          text('intro', 'Intro text', { max: 40 }),
          { type: 'list', key: 'items', label: 'Apps', itemLabel: 'App', titleKey: 'name', min: 0, max: 5,
            fields: [text('name', 'Name', { max: 20 }), { type: 'url', key: 'url', label: 'Store link (optional)', placeholder: 'https://' }],
            newItem: { name: '', url: '' } },
        ],
      },
      {
        id: 'customCta', label: 'Custom cake banner', description: 'Purple banner at the bottom of the page.', toggle: true,
        fields: [
          text('title', 'Heading', { max: 60 }), area('body', 'Text', { rows: 3, max: 240 }),
          text('button', 'Button label', { max: 32 }), MESSAGE(),
          image('image1', 'Photo 1'), image('image2', 'Photo 2 (middle, biggest)'), image('image3', 'Photo 3'),
        ],
      },
    ],
  },
  {
    id: 'cakes', label: 'Cakes', path: '/cakes', description: 'One-layer and celebration cakes.',
    sections: [
      header(),
      { id: 'steps', label: 'How it works', description: 'The four numbered steps under the banner.', toggle: true,
        fields: [text('step1', 'Step 1', { max: 24 }), text('step2', 'Step 2', { max: 24 }), text('step3', 'Step 3', { max: 24 }), text('step4', 'Step 4', { max: 24 })] },
      { id: 'oneLayer', label: 'One-layer cakes', fields: [text('title', 'Section title', { max: 40 }), area('subtitle', 'Intro text', { rows: 2, max: 160 }), text('tag', 'Badge', { max: 20, help: 'Leave empty to hide it.' })] },
      { id: 'celebration', label: 'Celebration cakes', fields: [text('title', 'Section title', { max: 40 }), area('subtitle', 'Intro text', { rows: 3, max: 200 })] },
      ctaPanel('Custom design banner', 'Purple banner at the bottom of the page.'),
    ],
  },
  {
    id: 'pastries', label: 'Pastries', path: '/pastries', description: 'Pies, rolls and more.',
    sections: [header(), ctaPanel('Bulk orders banner', 'Purple banner at the bottom of the page.')],
  },
  {
    id: 'smallChops', label: 'Small Chops', path: '/small-chops', description: 'Platters and catering.',
    sections: [
      header(),
      { id: 'platters', label: 'Platter sizes', fields: [
        text('title', 'Section title', { max: 40 }),
        { type: 'list', key: 'items', label: 'Platters', itemLabel: 'Platter', titleKey: 'name', min: 1, max: 6,
          fields: [text('name', 'Name', { max: 30 }), area('description', 'Description', { rows: 2, max: 140 }),
            text('serves', 'Serves', { max: 24 }), text('badge', 'Badge (optional)', { max: 16 }), image('image', 'Photo')],
          newItem: { name: '', description: '', serves: '', badge: '', image: '/images/smallchops-starter.jpg' } },
      ] },
      { id: 'packages', label: 'More packages', note: { text: 'The packages themselves are managed on the Products page.', href: '/admin/products', linkLabel: 'Open Products' },
        fields: [text('title', 'Section title', { max: 40 })] },
      { id: 'combo', label: 'Build your own mix card', toggle: true,
        fields: [text('title', 'Heading', { max: 40 }), area('body', 'Text', { rows: 3, max: 200 }), text('button', 'Button label', { max: 28 })] },
      { id: 'catering', label: 'Event catering card', toggle: true,
        fields: [text('title', 'Heading', { max: 40 }), area('body', 'Text', { rows: 3, max: 200 }), text('button', 'Button label', { max: 28 }), MESSAGE()] },
    ],
  },
  {
    id: 'dailyTreats', label: 'Daily Treats', path: '/daily-treats', description: 'Grab-and-go treats.',
    sections: [header()],
  },
  {
    id: 'events', label: 'Events', path: '/events', description: 'Corporate and event orders.',
    sections: [
      header(),
      { id: 'panel', label: 'Events panel', description: 'The purple panel at the top of the page.', fields: [
        text('title', 'Heading', { max: 50 }), area('body', 'Text', { rows: 3, max: 220 }), text('button', 'Button label', { max: 32 }), MESSAGE(),
        { type: 'list', key: 'options', label: 'What we offer', itemLabel: 'Item', titleKey: 'text', min: 1, max: 6,
          fields: [text('text', 'Text', { max: 40 })], newItem: { text: '' } },
      ] },
    ],
  },
  {
    id: 'gallery', label: 'Gallery', path: '/gallery', description: 'Cakes you\'ve made.',
    sections: [
      header(),
      { id: 'cards', label: 'Gallery cards', note: { text: 'The photos themselves are managed in the Gallery Manager.', href: '/admin/gallery', linkLabel: 'Open Gallery Manager' },
        fields: [text('hoverLabel', 'Label when hovering a photo', { max: 30 })] },
      { id: 'merch', label: 'BakersMerch banner', toggle: true,
        fields: [text('title', 'Heading', { max: 50 }), area('body', 'Text', { rows: 2, max: 160 }), text('button', 'Button label', { max: 30 }), { type: 'url', key: 'url', label: 'Button link' }] },
    ],
  },
  {
    id: 'about', label: 'About', path: '/about', description: 'Your story.',
    sections: [
      header(),
      { id: 'story', label: 'Our story', fields: [
        text('title', 'Section title', { max: 40 }), area('body', 'Story', { rows: 6, rich: true, help: RICH_HELP }), image('image', 'Photo'),
        text('badgeValue', 'Photo badge number', { max: 10 }), text('badgeLabel', 'Photo badge label', { max: 24 }),
        { type: 'list', key: 'reasons', label: 'Why Bloomies', itemLabel: 'Reason', titleKey: 'title', min: 1, max: 4,
          fields: [text('title', 'Title', { max: 30 }), area('text', 'Text', { rows: 2, max: 140 })], newItem: { title: '', text: '' } },
        text('button', 'Button label', { max: 24 }), MESSAGE(),
      ] },
      { id: 'owner', label: 'The baker', toggle: true, fields: [
        text('title', 'Section title', { max: 40 }), area('body', 'Text', { rows: 5, rich: true, help: RICH_HELP }), image('image', 'Photo'),
        text('badgeValue', 'Photo badge number', { max: 10 }), text('badgeLabel', 'Photo badge label', { max: 24 }),
        { type: 'list', key: 'tags', label: 'Specialities', itemLabel: 'Tag', titleKey: 'text', min: 0, max: 6, fields: [text('text', 'Text', { max: 24 })], newItem: { text: '' } },
      ] },
      { id: 'reviews', label: 'Customer reviews', toggle: true, fields: [
        text('title', 'Section title', { max: 40 }),
        { type: 'list', key: 'items', label: 'Reviews', itemLabel: 'Review', titleKey: 'name', min: 1, max: 8,
          fields: [area('quote', 'Review', { rows: 3, max: 260 }), text('name', 'Name', { max: 30 }), text('source', 'Source', { max: 40 })],
          newItem: { quote: '', name: '', source: 'Google review' } },
      ] },
    ],
  },
  {
    id: 'policy', label: 'Policy', path: '/policy', description: 'Terms, refunds and privacy.',
    sections: [
      header(),
      { id: 'sections', label: 'Policy sections', description: 'Shown in this order, lettered A, B, C…', fields: [
        { type: 'list', key: 'items', label: 'Sections', itemLabel: 'Section', titleKey: 'title', min: 1, max: 15,
          fields: [text('title', 'Heading', { max: 60 }), area('body', 'Text', { rows: 7, rich: true, help: RICH_HELP })],
          newItem: { title: '', body: '' } },
      ] },
      { id: 'contact', label: 'Questions box', fields: [
        text('title', 'Heading', { max: 40 }), text('button', 'Button label', { max: 24 }), MESSAGE(), text('updated', 'Last updated line', { max: 90 }),
      ] },
    ],
  },
];

export const pageDef = (id: string) => PAGES.find(p => p.id === id) ?? PAGES[0];
