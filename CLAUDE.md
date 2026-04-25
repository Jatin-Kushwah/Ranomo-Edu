# study-abroad-project — CLAUDE.md

## Overview

A fully static study abroad consulting website built with Astro 6, Tailwind CSS v4, and deployed on Netlify free tier. No backend, no database, no CMS.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Astro | 6.x | Static site framework |
| Tailwind CSS | 4.x | Styling (no `tailwind.config.js` — all config in `src/styles/global.css` via `@theme {}`) |
| `@tailwindcss/vite` | 4.x | Vite plugin for Tailwind v4 (NOT `@astrojs/tailwind`) |
| `@astrojs/sitemap` | 3.x | Auto-generates `sitemap-index.xml` at build |
| `astro-seo` | 1.x | SEO meta, OG, Twitter card tags |
| `astro-google-fonts-optimizer` | 0.2.x | Inlines Google Fonts CSS at build time |
| `@lucide/astro` | 1.x | Build-time SVG icons (zero JS) |
| `flag-icons` | 7.x | Country flag CSS sprites via ISO alpha-2 codes |
| `aos` | 2.x | Scroll animations (initialized on load + `astro:after-swap`) |
| `@astrojs/rss` | 4.x | RSS feed endpoint |
| Netlify | Free | Hosting + Forms (100 submissions/month) |

## Folder Structure

```
study-abroad-project/
├── astro.config.mjs          ← site URL, sitemap integration, Tailwind vite plugin
├── netlify.toml              ← base = "study-abroad-project/", command, publish = "dist"
├── public/
│   ├── robots.txt            ← crawlers allowed, sitemap URL
│   ├── favicon.svg
│   ├── og/                   ← 1200×630 OG images per page
│   └── images/               ← hero + section photos (WebP, downloaded — no hotlinks)
└── src/
    ├── styles/global.css     ← @import "tailwindcss"; @theme { ... }
    ├── scripts/aosInit.ts    ← AOS.init() + astro:after-swap handler
    ├── data/                 ← TypeScript data files (destinations, services, etc.)
    ├── content/
    │   ├── config.ts         ← Zod schemas for Content Collections
    │   └── blog/             ← .md blog posts
    ├── layouts/
    │   └── BaseLayout.astro  ← SEO, ViewTransitions, AOS, JSON-LD, WhatsApp button
    ├── components/
    │   ├── Header.astro      ← sticky, CSS-only hamburger, transition:persist
    │   ├── Footer.astro
    │   ├── WhatsAppButton.astro
    │   ├── DestinationCard.astro
    │   ├── ui/               ← Button.astro, Badge.astro
    │   └── sections/         ← one file per home page section
    └── pages/                ← Astro page routes
```

## Common Tasks

### Add a new destination country

1. Add an entry to `src/data/destinations.ts` following the `Destination` type
2. Use the ISO 3166-1 alpha-2 code for `isoCode` (e.g., `"jp"` for Japan)
3. Add a hero image to `src/assets/images/destinations/` (WebP, ≥1200px wide)
4. The `[country].astro` template generates the page automatically via `getStaticPaths()`

### Add a new blog post

1. Create a new `.md` file in `src/content/blog/` using kebab-case filename
2. Include required frontmatter: `title`, `description`, `pubDate`, `tags`
3. Optionally add `heroImage` pointing to a file in `src/assets/blog/`
4. The blog listing and RSS feed update automatically

### Update Tailwind design tokens

Edit the `@theme {}` block in `src/styles/global.css`. No `tailwind.config.js` exists — Tailwind v4 reads all config from CSS.

### Change contact form notification email

1. Go to Netlify dashboard → your site → Forms → `contact`
2. Click "Form notifications" → Add notification → Email notification
3. Enter the client's email address

## Deployment

### Initial deploy

1. Import this repository in the Netlify dashboard
2. Set **Base directory** to `study-abroad-project/` (critical for monorepo)
3. Build command: `yarn build` (auto-read from `netlify.toml`)
4. Publish directory: `dist` (auto-read from `netlify.toml`)

### Custom domain

Netlify → Domain management → Add custom domain → update DNS per Netlify instructions. SSL provisioned automatically.

## Limits & Monitoring

- **Netlify Forms**: 100 submissions/month on free tier. Check Netlify dashboard → Forms.
  - Upgrade path: Netlify Pro ($19/mo) gives 1,000/month; or switch to Web3Forms (250/month free)
- **Netlify Bandwidth**: 100 GB/month free. Monitor via Netlify dashboard → Usage.
- **Build minutes**: 300/month free. Each deploy takes ~60–90 seconds.

## Brand Placeholders

Search for these strings to replace before going live:

| Placeholder | Replace with |
|-------------|-------------|
| `ranomoedu.com` | Real domain |
| `Ranomo Edu` | Real brand name |
| `PHONENUMBER` | WhatsApp number (digits only, with country code, e.g. `919876543210`) |
| `hello@ranomoedu.com` | Real contact email |
| `+91 98765 43210` | Real phone number |
| `123 MG Road, Bengaluru 560001` | Real office address |

## Important Notes

- **Never hotlink images** — always download to `src/assets/` for build-time optimization
- **Images must be in `src/assets/`**, not `public/`, to use Astro's `<Image>` component
- **No `[[redirects]]` in netlify.toml** — Astro static output generates per-route HTML files; a catch-all would serve `index.html` for all 404s
- **Tailwind v4**: zero config files — never create `tailwind.config.js`
- **AOS + View Transitions**: `aosInit()` must be called on both page load AND `astro:after-swap`
