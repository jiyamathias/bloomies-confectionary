// Applies the SQL migrations in /drizzle to the database in DATABASE_URL.
//   npm run db:migrate
import { config } from 'dotenv';
config({ path: '.env.local' }); config();
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDb } from '@/lib/db';

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('✓ Database is up to date');
  process.exit(0);
}
main().catch(err => { console.error('Migration failed:', err); process.exit(1); });
