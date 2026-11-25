// Seed the database with the static product catalogue, gallery and default CMS content.
//   npm run db:seed
import { config } from 'dotenv';
config({ path: '.env.local' }); config();

import { getDb } from '@/lib/db';
import { products, galleryItems, settings, siteContent } from '@/lib/db/schema';
import { PRODUCTS } from '@/lib/products';
import { GALLERY } from '@/lib/products';

async function main() {
  const db = getDb();

  // ── Products ──────────────────────────────────────────────────────────────
  const productRows = PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    category: p.category,
    priceLabel: p.price ?? '',
    basePrice: p.basePrice ?? null,
    unitPrice: (p as { unitPrice?: number }).unitPrice ?? null,
    image: p.image,
    images: (p as { images?: string[] }).images ?? [],
    badge: p.badge ?? null,
    badgeColor: (p.badge_color as string) ?? 'rose',
    inStock: p.in_stock,
    featured: p.featured,
    sortOrder: p.sort_order,
    moq: (p as { moq?: string }).moq ?? null,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.insert(products).values(productRows as any).onConflictDoNothing();

  console.log(`✓ Seeded ${productRows.length} products`);

  // ── Gallery ───────────────────────────────────────────────────────────────
  const galleryRows = GALLERY.map((g, i) => ({
    id: undefined as unknown as string, // uuid auto
    title: g.title,
    image: g.image,
    category: g.category,
    sortOrder: i,
  }));

  // gallery_items uses uuid PK so just insert; skip if already seeded
  const existing = await db.select().from(galleryItems);
  if (existing.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(galleryItems).values(
      galleryRows.map(r => ({
        title:     r.title,
        image:     r.image,
        category:  r.category,
        sortOrder: r.sortOrder,
      })) as any
    );
    console.log(`✓ Seeded ${GALLERY.length} gallery items`);
  } else {
    console.log(`  Gallery already has ${existing.length} items — skipped`);
  }

  // ── Best sellers setting ──────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.insert(settings).values({ key: 'best_sellers', value: { productIds: ['ol-1', 'ol-2', 'pa-3', 'bc-1', 'dt-3', 'pa-5'] } } as any).onConflictDoNothing();

  console.log('✓ Seeded best_sellers setting');

  // ── CMS content (empty overrides – real defaults come from lib/content/defaults.ts) ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.insert(siteContent).values([
    { id: 'draft',     data: {}, updatedBy: null },
    { id: 'published', data: {}, updatedBy: null },
  ] as any).onConflictDoNothing();

  console.log('✓ Seeded site_content rows (draft + published)');
  process.exit(0);
}

main().catch(err => { console.error('Seed failed:', err); process.exit(1); });
