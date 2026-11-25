import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession, clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const store = await cookies();
  const token = store.get('bloomies_session')?.value;
  if (token) await deleteSession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
