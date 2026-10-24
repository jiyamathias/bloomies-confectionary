'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Star, Image as ImageIcon, LogOut, ExternalLink, Menu, X,
  Receipt, Users, Wallet,
} from 'lucide-react';
import { AdminDataProvider } from '@/lib/admin/store';

// PREVIEW ONLY: this password check runs in the browser. Real sign-in (server-side sessions)
// comes with the Neon backend.
const DEMO_PASSWORD = 'bloomies2025';

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
      { href: '/admin/products',     label: 'Products',        Icon: Package },
      { href: '/admin/best-sellers', label: 'Best Sellers',    Icon: Star },
      { href: '/admin/gallery',      label: 'Gallery Manager', Icon: ImageIcon },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [auth, setAuth]       = useState(false);
  const [checked, setChecked] = useState(false);
  const [pw, setPw]           = useState('');
  const [err, setErr]         = useState('');
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    setAuth(sessionStorage.getItem('bloomies_admin') === 'true');
    setChecked(true);
  }, []);
  useEffect(() => setSideOpen(false), [pathname]);

  function login() {
    if (pw === DEMO_PASSWORD) {
      sessionStorage.setItem('bloomies_admin', 'true');
      setAuth(true); setErr('');
    } else {
      setErr('That password is not right.');
    }
  }

  function logout() {
    sessionStorage.removeItem('bloomies_admin');
    setAuth(false);
    router.push('/admin');
  }

  if (!checked) return null;

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#E2BBFA] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 sm:p-10 w-full max-w-sm shadow-[0_20px_60px_rgba(67,48,117,0.18)]">
          <div className="text-center mb-8">
            <div className="font-luckiest tracking-[0.02em] text-[2.1rem] text-[#433075] leading-none">
              Bloomies<span className="text-[#A58CF4]">.</span>
            </div>
            <p className="text-[0.85rem] text-[#5E5A7C] mt-2">Admin sign in</p>
          </div>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); login(); }}>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Password" autoFocus aria-label="Password"
              className="w-full px-4 py-3 rounded-xl border border-[#D5D0E4] text-[0.9rem] text-[#2B2147]
                focus:border-[#433075] focus:outline-none"/>
            {err && <p className="text-[#B42318] text-[0.8rem]">{err}</p>}
            <button type="submit"
              className="w-full bg-[#433075] text-white py-3 rounded-full font-semibold text-[0.9rem] hover:bg-[#5B3E8A] transition-colors">
              Sign in
            </button>
          </form>
          <p className="text-center text-[0.75rem] text-[#5E5A7C] mt-6">
            Preview password: <code className="bg-[#F3F0FA] px-1.5 py-0.5 rounded text-[#433075] font-medium">bloomies2025</code>
          </p>
        </div>
      </div>
    );
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
          <button onClick={() => setSideOpen(v => !v)} className="text-white p-1.5" aria-label="Menu">
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
            <div className="bg-[#FFF6DB] border-b border-[#F0DFA6] text-[#6B4E00] text-[0.78rem] px-5 lg:px-8 py-2">
              Preview with sample data. Numbers are made up, and changes reset when you refresh. Live data comes when the database is connected.
            </div>
            {children}
          </div>
        </div>
      </div>
    </AdminDataProvider>
  );
}
