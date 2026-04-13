'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Star, LogOut, ExternalLink, Menu, X } from 'lucide-react';

const DEMO_PASSWORD = 'bloomies2025';

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

  function login() {
    if (pw === DEMO_PASSWORD) {
      sessionStorage.setItem('bloomies_admin', 'true');
      setAuth(true); setErr('');
    } else {
      setErr('Incorrect password. Try: bloomies2025');
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
      <div className="min-h-screen bg-gradient-to-br from-[#F0EBFF] via-[#F0EBFF] to-[#FFF0F7] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-[#C5B0E8]/50
          p-8 sm:p-10 w-full max-w-sm shadow-[0_20px_60px_rgba(155,111,186,0.15)]">
          <div className="text-center mb-8">
            <div className="font-cormorant text-[2rem] font-semibold text-[#5B2D8E] mb-1">
              Bloomies<span className="text-[#E8609A]">.</span>
            </div>
            <p className="text-[0.8rem] text-[#9B7EC8]">Admin Dashboard</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter admin password…"
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full px-4 py-3 rounded-xl border border-[#C5B0E8]/60
                text-[0.88rem] text-[#5B2D8E] focus:border-[#9B7EC8] focus:outline-none
                focus:ring-2 focus:ring-[#C5B0E8]/40"
            />
            {err && <p className="text-[#E8609A] text-[0.78rem]">{err}</p>}
            <button
              onClick={login}
              className="w-full bg-[#5B2D8E] text-white py-3 rounded-full font-medium
                text-[0.88rem] hover:bg-[#9B7EC8] transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-[0.72rem] text-[#7B5EA7]/60 mt-6">
            Demo password:{' '}
            <code className="bg-[#F0EBFF] px-1.5 py-0.5 rounded text-[#5B2D8E] font-medium">
              bloomies2025
            </code>
          </p>
        </div>
      </div>
    );
  }

  const NAV = [
    { href: '/admin',              label: 'Dashboard',    icon: <LayoutDashboard size={17} /> },
    { href: '/admin/products',     label: 'Products',     icon: <Package size={17} />         },
    { href: '/admin/best-sellers', label: 'Best Sellers', icon: <Star size={17} />            },
  ];

  return (
    <div className="min-h-screen bg-[#F0EBFF] flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#5B2D8E] min-h-screen shrink-0 fixed left-0 top-0 bottom-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-cormorant text-[1.5rem] font-semibold text-white">
            Bloomies<span className="text-[#E8DAFF]">.</span>
          </div>
          <p className="text-white/40 text-[0.7rem] mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem] transition-all duration-200
                ${pathname === n.href
                  ? 'bg-[#C5B0E8]/20 text-white font-medium border border-[#C5B0E8]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1 border-t border-white/10 pt-4">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem]
              text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200">
            <ExternalLink size={17} /> View Website
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem]
              text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#5B2D8E] px-4 h-14
        flex items-center justify-between">
        <div className="font-cormorant text-[1.3rem] font-semibold text-white">
          Bloomies<span className="text-[#E8DAFF]">.</span>
          <span className="text-white/40 text-[0.72rem] ml-2">Admin</span>
        </div>
        <button onClick={() => setSideOpen(v => !v)} className="text-white p-1.5">
          {sideOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSideOpen(false)}>
          <div className="absolute top-14 left-0 bottom-0 w-60 bg-[#5B2D8E] p-3 space-y-1"
            onClick={e => e.stopPropagation()}>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem]
                  ${pathname === n.href
                    ? 'bg-[#C5B0E8]/20 text-white font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                {n.icon} {n.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              <Link href="/" target="_blank" onClick={() => setSideOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem] text-white/50 hover:text-white">
                <ExternalLink size={17} /> View Website
              </Link>
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem] text-white/50 hover:text-white">
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-60 min-h-screen">
        <div className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
