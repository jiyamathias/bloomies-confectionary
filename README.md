# 🌸 Bloomies Confectioneries — Static Preview

> **Client preview build** — fully static, no database required. Run with just `npm install && npm run dev`.

---

## 🚀 Quick Start

```bash
unzip bloomies-static-preview.zip
cd bloomies
npm install
npm run dev
```

Open **http://localhost:3000** — website is live.  
Open **http://localhost:3000/admin** — admin dashboard.  
Admin password: **`bloomies2025`**

---

## 📱 Pages

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Hero · Categories · Best Sellers · Reviews |
| Cakes | `/cakes` | One-Layer + Custom Design, click to customise inline |
| Pastries | `/pastries` | All pastries with add-to-cart |
| Small Chops | `/small-chops` | Package cards → WhatsApp |
| Daily Treats | `/daily-treats` | Tap to add to cart |
| Events | `/events` | Corporate packages |
| Gallery | `/gallery` | Portfolio + BakersMerch redirect |
| About | `/about` | Story + Reviews |
| Admin | `/admin` | Dashboard overview |
| Admin › Products | `/admin/products` | Add / Edit / Delete / Toggle stock |
| Admin › Best Sellers | `/admin/best-sellers` | Edit section title + manage which products show |

---

## 🎂 How Cake Ordering Works

1. Customer visits `/cakes`
2. Clicks any cake → **customisation modal opens**
3. For **One-Layer cakes**: chooses flavour, icing type (price updates live!), colour, message, occasion, gender, delivery date + address, add-ons (card ₦3k, Chamdor ₦6k, candles ₦500/each)
4. For **Custom Design cakes**: chooses size, layers, flavours, design style, colour, topper, delivery details + same add-ons
5. Live price summary updates as options are selected
6. Customer taps **"Add to Cart"** or **"Order via WhatsApp"**

---

## 💳 Online Payments (Flutterwave)

Customers can pay from the cart with card, bank transfer or USSD. WhatsApp ordering stays available as an option.

**Turn it on**
1. Copy `.env.example` to `.env.local` and set `FLW_SECRET_KEY` (Flutterwave dashboard → Settings → API keys).
   Use the **test** key (`FLWSECK_TEST-…`) first; switch to the live key when ready.
2. Set `SITE_URL` to the live address (e.g. `https://bloomies.ng`) on the server.
3. Restart the site. Without a key, the cart quietly falls back to WhatsApp-only.

**What can be paid online**
- Cakes built in the cake form (price is calculated from size, icing and add-ons).
- Items with an exact price, set as `unitPrice` in `lib/products.ts` (e.g. Meat Pies `unitPrice: 5000`).
- Anything priced "From…", "Custom Pricing", deluxe flavours and event orders still go through WhatsApp.
  To make an item payable, give it a `unitPrice`.

**How it works**
- `app/api/checkout` recalculates every price on the server (`lib/pricing.ts`) and creates the Flutterwave payment.
- After paying, customers land on `/checkout/complete`, which confirms the payment with Flutterwave
  (`app/api/checkout/verify`) and offers to send the order details on WhatsApp.
- Each paid order shows in the Flutterwave dashboard with the customer's phone, pickup/delivery and order summary.
- Delivery fees aren't charged online; they're confirmed on WhatsApp.

---

## ⭐ Best Sellers Section (Admin)

Go to `/admin/best-sellers` to:
- **Edit the section title** (shown on home page)
- **Add products** from a picker (max 6)
- **Reorder** with ▲ ▼ arrows
- **Remove** products from the section
- Changes **save automatically** and reflect instantly on the home page

---

## 🛍️ Cart → WhatsApp Checkout

1. Customer adds items to cart
2. Opens cart → enters name + phone
3. Taps **Checkout via WhatsApp** → opens WhatsApp with auto-filled order message listing all items, quantities, prices and customisations

---

## 📁 Structure

```
bloomies/
├── app/
│   ├── page.tsx                    # Home (hero, categories, best sellers, reviews)
│   ├── cakes/page.tsx              # One-Layer + Custom Design Cakes
│   ├── pastries/page.tsx
│   ├── small-chops/page.tsx
│   ├── daily-treats/page.tsx
│   ├── events/page.tsx
│   ├── gallery/page.tsx            # Portfolio + BakersMerch
│   ├── about/page.tsx
│   └── admin/
│       ├── layout.tsx              # Auth gate (password: bloomies2025)
│       ├── page.tsx                # Dashboard overview
│       ├── products/page.tsx       # Full product CRUD
│       └── best-sellers/page.tsx   # Best Sellers section manager
├── components/
│   ├── Navbar.tsx                  # Mobile-first nav (WhatsApp hidden on mobile)
│   ├── CartDrawer.tsx              # Slide-in cart with WhatsApp checkout
│   ├── ProductCard.tsx             # Card + inline customise modal for cakes
│   ├── CakeOrderForm.tsx           # Full cake order form (1-layer + bigger cakes)
│   ├── BestSellers.tsx             # Best Sellers section (reads from localStorage)
│   ├── Footer.tsx
│   ├── PageHeader.tsx
│   ├── WhatsAppBtn.tsx
│   ├── Toast.tsx
│   └── ClientShell.tsx
├── lib/
│   ├── products.ts                 # All products + Best Sellers config + helpers
│   └── cart.tsx                    # Cart context + WhatsApp message builders
├── types/index.ts
├── public/images/                  # 45+ local images (no remote dependency)
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

---

## 📞 Business Info

- **Phone:** 08181154270  
- **Instagram:** @bloomies.ng  
- **Location:** No 33 Amadimati Street, Mgbuoba, Port Harcourt  
- **Hours:** Open daily · Closes 5 PM  
- **Order via:** Glovo, Chowdeck, WhatsApp

---

## ⏭️ After Client Approval

1. Add Supabase project (schema will be provided)
2. Add `.env.local` with Supabase URL + anon key
3. Products, best sellers config, and all admin changes become fully persistent
