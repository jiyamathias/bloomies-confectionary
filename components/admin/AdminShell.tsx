'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Star, Image as ImageIcon, LogOut, ExternalLink, Menu, X,
  Receipt, Users, Wallet, PenLine,
} from 'lucide-react';
import { AdminDataProvider } from '@/lib/admin/store';

const NAV_GROUPS = [
  {
    title: 'Business',
    items: [
      { href: '/admin',           label: 'Overview',  Icon: LayoutDashboard },
      { href: '/admin/sales',     label: 'Sales log', Icon: Receipt },
      { href: '/admin/customers', label: 'Customers', Icon: Users },
      { href: '/admin/expenses',  label: 'Expenses',  Icon: Wallet },
    ],
  },
  {
    title: 'Website',
    items: [
      { href: '/admin/content',      label: 'Website content', Icon: PenLine },
      { href: '/admin/products',     label: 'Products',        Icon: Package },
      { href: '/admin/best-sellers', label: 'Best Sellers',    Icon: Star },
      { href: '/admin/gallery',      label: 'Gallery Manager', Icon: ImageIcon },
    ],
  },
];

export default function AdminShell({ children, hasDb }: { children: React.ReactNode; hasDb: boolean }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => setSideOpen(false), [pathname]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
      {NAV_GROUPS.map(g => (
        <div key={g.title}>
          <p className="px-3 mb-1.5 text-[0.68rem] tracking-[0.12em] uppercase text-white/50">{g.title}</p>
          <div className="space-y-0.5">
            {g.items.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] transition-colors
                    ${active ? 'bg-white text-[#433075] font-semibold' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                  <Icon size={17}/> {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="px-3 pb-5 pt-3 space-y-0.5 border-t border-white/10">
      <Link href="/" target="_blank"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] text-white/80 hover:text-white hover:bg-white/10">
        <ExternalLink size={17}/> View website
      </Link>
      <button onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] text-white/80 hover:text-white hover:bg-white/10">
        <LogOut size={17}/> Sign out
      </button>
    </div>
  );

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-[#F6F4FB] flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-[#433075] shrink-0 fixed left-0 top-0 bottom-0">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="font-luckiest tracking-[0.02em] text-[1.6rem] text-white leading-none">
              Bloomies<span className="text-[#E2BBFA]">.</span>
            </div>
            <p className="text-white/60 text-[0.75rem] mt-1.5">Admin</p>
          </div>
          {nav}
          {footer}
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#433075] px-4 h-14 flex items-center justify-between">
          <div className="font-luckiest tracking-[0.02em] text-[1.35rem] text-white leading-none pt-1">
            Bloomies<span className="text-[#E2BBFA]">.</span>
            <span className="font-dm text-white/60 text-[0.75rem] ml-2 tracking-normal">Admin</span>
          </div>
          <button onClick={() => setSideOpen(v => !v)} className="text-white w-10 h-10 -mr-2 flex items-center justify-center" aria-label="Menu" aria-expanded={sideOpen}>
            {sideOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
        {sideOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSideOpen(false)}>
            <div className="absolute top-14 left-0 bottom-0 w-64 bg-[#433075] flex flex-col" onClick={e => e.stopPropagation()}>
              {nav}
              {footer}
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 lg:ml-60 min-h-screen min-w-0">
          <div className="pt-14 lg:pt-0 min-h-screen">
            {!hasDb && (
              <div className="bg-[#FFF6DB] border-b border-[#F0DFA6] text-[#6B4E00] text-[0.78rem] px-5 lg:px-8 py-2">
                Preview mode — database not connected. Changes will not be saved.
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </AdminDataProvider>
  );
}
