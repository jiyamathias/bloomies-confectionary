import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/auth';
import { hasDatabase } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const dbReady = hasDatabase();

  if (dbReady) {
    const session = await getSessionFromCookie();
    if (!session) redirect('/admin/login');
  }
  // When DATABASE_URL is absent (e.g. preview deploys) we let anyone through
  // but the banner in AdminShell makes the limitation clear.

  return <AdminShell hasDb={dbReady}>{children}</AdminShell>;
}
