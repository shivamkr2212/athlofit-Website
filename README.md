# Athlofit Website (Next.js)

SEO-optimized, server-rendered public website for Athlofit — replaces the old Vite SPA.
Built with **Next.js 14 (App Router)**, Tailwind CSS, and the shared Athlofit backend API.

## Why Next.js

- **SSR/ISR** — product, blog, and legal pages are server-rendered with real-time data and per-page meta tags, so they're fully crawlable and shareable.
- **Dynamic SEO** — `generateMetadata` produces unique title/description/OG/Twitter tags per product and blog post.
- **Structured data** — JSON-LD for Organization, Product (price/rating/availability), BlogPosting, Breadcrumbs, and ContactPage.
- **Auto sitemap + robots** — `/sitemap.xml` is generated from live products, blogs, and legal pages; regenerates hourly.

## Features

- **Dynamic product pages** (`/shop/[id]`) with Razorpay checkout
- **Dynamic blog** (`/blogs`, `/blogs/[slug]`) managed from the admin panel
- **All legal/policy pages** (`/legal/[type]`) managed from the admin panel:
  Terms, Privacy, Coin Earning & Rewards, Coin Redemption, Community Guidelines,
  Data Deletion, Medical/Fitness Disclaimer, Refund
- **Dynamic app store links** and social links pulled from app config
- **Cart + checkout** with coin payment and Razorpay (UPI/card)

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=https://athlofit-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://athlofit.com
```

## Scripts

```bash
npm install
npm run dev      # http://localhost:3001
npm run build
npm run start
```

## Razorpay

Enable the "Razorpay checkout on website" toggle in the admin panel (App Config → Website SEO & Payments).
The checkout flow:

1. Client requests `POST /payment/create-order` (server validates cart + creates Razorpay order)
2. Razorpay modal opens via the checkout script
3. On success, client calls `POST /payment/verify` (server verifies signature, decrements stock, marks order PAID)
4. `POST /payment/webhook` acts as a server-side safety net for capture/failure events

Backend env required: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
