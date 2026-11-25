'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Sign in failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#E2BBFA] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 sm:p-10 w-full max-w-sm shadow-[0_20px_60px_rgba(67,48,117,0.18)]">
        <div className="text-center mb-8">
          <div className="font-luckiest tracking-[0.02em] text-[2.1rem] text-[#433075] leading-none">
            Bloomies<span className="text-[#A58CF4]">.</span>
          </div>
          <p className="text-[0.85rem] text-[#5E5A7C] mt-2">Admin sign in</p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" autoFocus aria-label="Email"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#D5D0E4] text-[0.9rem] text-[#2B2147]
              focus:border-[#433075] focus:outline-none"/>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" aria-label="Password"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#D5D0E4] text-[0.9rem] text-[#2B2147]
              focus:border-[#433075] focus:outline-none"/>
          {error && <p className="text-[#B42318] text-[0.8rem]">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#433075] text-white py-3 rounded-full font-semibold text-[0.9rem]
              hover:bg-[#5B3E8A] transition-colors disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
