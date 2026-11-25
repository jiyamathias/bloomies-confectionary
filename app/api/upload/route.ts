// POST /api/upload
// Body: { filename: string; contentType: string }
// Returns: { uploadUrl: string; publicUrl: string }
// The client PUTs the file directly to R2 using uploadUrl,
// then stores publicUrl as the image src.
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { hasR2, presignUpload } from '@/lib/r2';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

const schema = z.object({
  filename:    z.string().min(1).max(256),
  contentType: z.string().min(1).max(100),
});

const ALLOWED_TYPES = new Set([
  'image/jpeg','image/jpg','image/png','image/webp','image/avif','image/gif',
]);

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!hasR2()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { filename, contentType } = parsed.data;
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({ error: 'Content type not allowed' }, { status: 400 });
  }

  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const key = `uploads/${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const { uploadUrl, publicUrl } = await presignUpload(key, contentType);

  return NextResponse.json({ uploadUrl, publicUrl });
}
