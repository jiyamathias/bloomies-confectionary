// Creates or updates an admin user.
// Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=changeme npm run admin:create
import { config } from 'dotenv';
config({ path: '.env.local' }); config();

import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { getDb } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars');
    process.exit(1);
  }

  const db = getDb();
  const passwordHash = await hashPassword(password);

  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(sql`lower(${adminUsers.email})`, email));

  if (existing.length > 0) {
    await db
      .update(adminUsers)
      .set({ passwordHash, email })
      .where(eq(sql`lower(${adminUsers.email})`, email));
    console.log(`✓ Updated admin: ${email}`);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(adminUsers).values({ email, name: email.split('@')[0], passwordHash } as any);
    console.log(`✓ Created admin: ${email}`);
  }

  process.exit(0);
}

main().catch(err => { console.error('create-admin failed:', err); process.exit(1); });
