// Database connection. Server-only: never import this from a client component.
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/lib/db/schema';

export type Db = NodePgDatabase<typeof schema>;

// Reuse one small pool per server instance (and across hot reloads in development).
const g = globalThis as unknown as { __bloomiesPool?: Pool; __bloomiesDb?: Db };

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

/** Lazily connects, so `next build` works even before DATABASE_URL is set. */
export function getDb(): Db {
  if (g.__bloomiesDb) return g.__bloomiesDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  g.__bloomiesPool = new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 20_000,
    // Neon requires TLS; local development databases usually don't.
    ssl: /sslmode=require|neon\.tech/.test(url) ? { rejectUnauthorized: true } : undefined,
  });
  g.__bloomiesDb = drizzle(g.__bloomiesPool, { schema });
  return g.__bloomiesDb;
}

export { schema };
