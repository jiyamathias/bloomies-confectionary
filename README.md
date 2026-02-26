# 🌸 Bloomies Confectioneries

Next.js 15 · React 19 · Tailwind CSS · TypeScript · Full SEO · WhatsApp ordering

---

## ⚡ Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## 🔧 Dependency Fix (what was wrong before)

| Issue | Cause | Fix applied |
|-------|-------|-------------|
| `npm error notarget resolve@1.22.11` | Next.js 14.2.0 had a transitive dep on a non-existent `resolve` version | Upgraded to **Next.js 15.2.1** |
| `deprecated next@14.2.0` security warning | CVE in older Next.js | **Next.js 15.2.1** is fully patched |
| `deprecated eslint@8` | ESLint 8 is EOL | Upgraded to **ESLint 9** with flat config (`eslint.config.mjs`) |

All peer deps (`@types/react`, `react`, `react-dom`) updated to match React 19.

---

## 🖼️ Switching to Your Own Photos

All image paths are centralised in **`components/images.ts`** — one file to update.

**Steps:**
1. Save your Bloomies photos into `public/images/` (create the folder if needed)
2. Open `components/images.ts`
3. Replace each `src` Unsplash URL with a local path, e.g.:

```ts
// Before
src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&q=80'

// After  
src: '/images/hero-1.jpg'
```

4. Once all images are local, remove `remotePatterns` from `next.config.ts` — you won't need it

**Suggested filenames** (see `components/images.ts` for the full list):
```
public/images/
  hero-1.jpg     hero-2.jpg    hero-3.jpg    hero-4.jpg    hero-5.jpg    hero-6.jpg
  about.jpg      order.jpg
  strip-1.jpg    strip-2.jpg   strip-3.jpg
  menu-1.jpg  →  menu-14.jpg   (one per menu item)
```

---

## 🔍 SEO

| Feature | File |
|---------|------|
| Title, description, keywords | `app/layout.tsx` |
| Open Graph (WhatsApp/Facebook share) | `app/layout.tsx` |
| Twitter card | `app/layout.tsx` |
| JSON-LD Bakery schema + ratings | `app/layout.tsx` |
| Sitemap | `app/sitemap.ts` → `/sitemap.xml` |
| Robots.txt | `app/robots.ts` → `/robots.txt` |
| Security headers | `next.config.ts` |
| Semantic HTML | All components |
| ARIA labels | All interactive elements |
| Image alt text | `components/images.ts` |

> Update `SITE_URL = 'https://bloomies.ng'` in `app/layout.tsx` before deploying.

---

## 🚀 Deploy to Vercel (free)

```bash
# 1. Push project to GitHub
# 2. Go to vercel.com → Add New Project → import repo
# 3. Click Deploy — Vercel auto-detects Next.js 15 ✅
```

---

## 💬 Change WhatsApp Number

Edit `components/Menu.tsx` and `components/OrderSection.tsx`:
```ts
const WA = '2348181154270'  // ← replace with actual number
```

---

## 📁 Structure

```
bloomies-final/
├── app/
│   ├── layout.tsx        # Root layout + SEO metadata + JSON-LD
│   ├── page.tsx          # Page composition
│   ├── globals.css       # Tailwind base + shimmer/reveal/grain utilities
│   ├── sitemap.ts        # /sitemap.xml
│   └── robots.ts         # /robots.txt
├── components/
│   ├── images.ts         # ← centralised image paths (swap yours here)
│   ├── Navbar.tsx        # Floating pill nav + animated hamburger
│   ├── Hero.tsx          # Cinematic mosaic hero (6-panel grid)
│   ├── MarqueeBand.tsx   # Animated gold ticker
│   ├── About.tsx         # Story + stats + floating cards
│   ├── Menu.tsx          # 14-item menu + category filter + cart + WhatsApp
│   ├── WhyUs.tsx         # 6-feature grid + image strip (dark section)
│   ├── Reviews.tsx       # 6 testimonials + 5.0 rating display
│   ├── OrderSection.tsx  # Order + contact info
│   ├── Footer.tsx        # 3-column footer
│   ├── Eyebrow.tsx       # Reusable section label
│   └── useReveal.ts      # IntersectionObserver scroll-reveal hook
├── public/
│   └── images/           # ← Put your Bloomies photos here
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs     # ESLint 9 flat config
└── tsconfig.json
```
