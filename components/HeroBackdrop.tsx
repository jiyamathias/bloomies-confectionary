'use client';
import { useEffect, useState, useCallback } from 'react';

// Resized WebP copies of /images/cakes (max 1800px) so the hero loads fast on mobile.
const LEFT_IMAGES = [
  '/images/hero/1.webp',
  '/images/hero/3.webp',
  '/images/hero/5.webp',
  '/images/hero/7.webp',
];

const RIGHT_IMAGES = [
  '/images/hero/2.webp',
  '/images/hero/4.webp',
  '/images/hero/6.webp',
  '/images/hero/8.webp',
];

const INTERVAL = 4200;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');

  const advance = useCallback(() => {
    setPhase('exit');
    setTimeout(() => {
      setCurrent(i => (i + 1) % LEFT_IMAGES.length);
      setPhase('idle');
    }, 700);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(advance, INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const getClass = (i: number, side: 'left' | 'right') => {
    const base = `hero-bg-slide hero-bg-slide-${side}`;
    if (i !== current) return base;
    if (phase === 'exit') return `${base} exiting`;
    return `${base} active`;
  };

  return (
    <div className="hero-bg-split" aria-hidden="true">
      {/* LEFT half — slides from top */}
      <div className="hero-bg-half hero-bg-half-left">
        {LEFT_IMAGES.map((src, i) => (
          <div key={src} className={getClass(i, 'left')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* RIGHT half — slides from bottom */}
      <div className="hero-bg-half hero-bg-half-right">
        {RIGHT_IMAGES.map((src, i) => (
          <div key={src} className={getClass(i, 'right')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Overlay for text readability */}
      <div className="hero-bg-overlay" />
    </div>
  );
}
