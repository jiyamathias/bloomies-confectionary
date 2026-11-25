// Server-only auth utilities. Never import this from a client component.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { adminUsers, sessions } from '@/lib/db/schema';
import { eq, sql, gt } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

const COOKIE_NAME = 'bloomies_session';
const SESSION_TTL_DAYS = 30;

// ── Password hashing ──────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(':');
  if (!salt || !hashHex) return false;
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedHash = Buffer.from(hashHex, 'hex');
  if (hash.length !== storedHash.length) return false;
  return timingSafeEqual(hash, storedHash);
}

// ── Sessions ──────────────────────────────────────────────────────────────────

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const id = tokenHash(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const db = getDb();
  await db.insert(sessions).values({ id, userId, expiresAt });
  return token;
}

export async function getSession(token: string) {
  const id = tokenHash(token);
  const db = getDb();
  const rows = await db
    .select({
      sessionId: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      userEmail: adminUsers.email,
      userName: adminUsers.name,
      userRole: adminUsers.role,
    })
    .from(sessions)
    .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
    .where(eq(sessions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }
  return { userId: row.userId, email: row.userEmail, name: row.userName, role: row.userRole };
}

export async function deleteSession(token: string) {
  const id = tokenHash(token);
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.id, id));
}

// ── Cookie helpers (server components / route handlers) ───────────────────────

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionFromCookie() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return getSession(token);
}

// ── Route guard ───────────────────────────────────────────────────────────────

/** Call at the top of admin API routes. Returns null when unauthenticated. */
export async function requireAdmin() {
  return getSessionFromCookie();
}

// ── Login helper ──────────────────────────────────────────────────────────────

export async function loginWithPassword(email: string, password: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(sql`lower(${adminUsers.email})`, email.toLowerCase()))
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  // bump last login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.update(adminUsers).set({ lastLoginAt: new Date() } as any).where(eq(adminUsers.id, user.id));
  return user;
}
