'use client';
import { useEffect, useState } from 'react';

// Reuses the same bakery photography already trusted elsewhere on this page
// (the floating circles), so the backdrop feels like an extension of the
// foreground rather than a new, disconnected set of images.
const SLIDES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1800&q=80&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1800&q=80&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1800&q=80&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1800&q=80&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1800&q=80&fit=crop&crop=center',
];

export default function HeroBackdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.6s ease-in-out',
            filter: 'saturate(0.55) brightness(1.08)',
          }}
        />
      ))}
      {/* Lavender-mist tint — keeps the brand palette and text contrast intact
          while letting the photography shuffle softly underneath. */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg,rgba(243,240,250,0.93) 0%,rgba(237,232,247,0.90) 55%,rgba(248,245,255,0.95) 100%)' }}
      />
    </div>
  );
}
