import { NextRequest, NextResponse } from 'next/server';
import { loginWithPassword, createSession, setSessionCookie } from '@/lib/auth';
import { hasDatabase } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const user = await loginWithPassword(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
