---
title: "feat: Website Brand & Content Refresh with AI Positioning"
type: feat
status: active
date: 2026-05-10
origin: docs/brainstorms/2026-05-10-website-refresh-requirements.md
---

# feat: Website Brand & Content Refresh with AI Positioning

## Overview

A cross-site content and brand refresh for Ranamo Edu covering: a new inline SVG logo (stylised R + rocket), updated hero copy and stats, "AI" woven into 5+ natural touchpoints, removal of Blog and Success Stories from navigation and the homepage, a rewritten About page, and a consistent "Book Consultation" (not "Free") CTA across all pages.

All changes are pure HTML/SVG/copy edits to a fully static Astro 6 + Tailwind CSS v4 site. No new routes, data files, or dependencies are introduced.

## Problem Frame

The site's current messaging underplays AI as a differentiator, carries inflated social-proof numbers (5,000+) that undermine credibility, surfaces Blog and Success Stories sections that dilute the navigation, and uses "Free Consultation" language that may devalue the service. This refresh aligns copy, numbers, and brand presentation with the company's positioning as an AI-powered study-abroad platform.

See origin document: `docs/brainstorms/2026-05-10-website-refresh-requirements.md`

## Requirements Trace

- R1–R2: Logo and wordmark (Header + Footer)
- R3–R8: Hero section copy and card
- R9: Destinations strip eyebrow label
- R10–R12: Services section heading and description
- R13–R15: How It Works eyebrow and step 1
- R16: Stats section numbers and labels
- R17–R19: Navigation cleanup (Blog + Success Stories) and homepage component removal
- R20–R22: CTA section copy and trust badges
- R23–R26: Footer brand column, description, social icons, address
- R27–R32: About page hero, mission text, stats, sections removed, CTA
- R33: Services page CTA text
- R34: Resolved — services.astro has no trust strip; this was a file-attribution error in the requirements doc. The equivalent stat update is covered by R36 on contact.astro.
- R35–R36: Contact page hero subtitle and trust strip
- R37–R38: Header dialog and desktop CTA button text
- R39: AI positioning consistency across site

## Scope Boundaries

- Do not delete `src/pages/blog/`, `src/pages/success-stories.astro`, or any blog content — only remove nav links and homepage sections
- Do not change `src/data/services.ts`, `src/data/destinations.ts`, or any data files
- Do not modify the contact form, Netlify Forms integration, or WhatsApp button
- Do not change `src/styles/global.css`, `astro.config.mjs`, or Tailwind configuration
- The physical address block in `src/pages/contact.astro` contact info card is retained (only the footer address block is removed)
- Blog post body text (`src/content/blog/`) is out of scope even though it contains "free consultation" wording
- `src/pages/destinations/index.astro` "Book a free consultation" text is out of scope (not in requirements)

## Context & Research

### Relevant Code and Patterns

- **Logo pattern**: Both `src/components/Header.astro` and `src/components/Footer.astro` embed a `viewBox="0 0 32 32"` SVG inline inside the logo `<a>` tag. The header version uses `fill="currentColor"` on the background so it inherits the parent's `text-(--color-primary)`. The footer version hard-codes `fill="#1e40af"`. Both must be replaced independently — there is no shared logo component.
- **Wordmark**: Currently a bare text node `Ranamo Edu` inside the `<a>`. Splitting into two `<span>` elements with different colours is a safe in-place change.
- **Nav arrays**: `navLinks` in `Header.astro` (lines 4–11) feeds both desktop and mobile menus via a single `{navLinks.map(...)}` — one array edit removes both. `quickLinks` in `Footer.astro` (lines 4–12) is separate.
- **"Free Consultation" occurrences**: 14 instances across 9 files. The 6 in scope for this plan are in: `Header.astro` (×2), `CTASection.astro` (×1), `Hero.astro` (×1), `about.astro` (×2), `services.astro` (×2), `contact.astro` (×1). `success-stories.astro`, `destinations/index.astro`, and the blog post body are out of scope.
- **Section data**: Section components hold their data as inline `const` arrays in frontmatter (no prop drilling). `ServicesSection`, `DestinationsStrip`, `Testimonials` import from `src/data/`; all others are self-contained.
- **Button component**: Used in `Header.astro` (desktop CTA) and `Hero.astro` only. All other CTAs across the site are hand-coded `<a>` elements.
- **Orphan check**: Removing `<Testimonials />` and `<BlogTeaser />` from `index.astro` leaves no orphaned CSS or JS. Both components are purely server-rendered markup; their CSS classes are also used by other components; `Badge.astro` (used by BlogTeaser) continues to be used in `src/pages/blog/[slug].astro`.

### Institutional Learnings

- No `docs/solutions/` directory exists yet. No prior institutional learnings to apply.

### External References

- None required. All patterns are established locally.

## Key Technical Decisions

- **SVG logo as inline paths, not image file**: Keeps the zero-dependency static build intact, avoids a new asset pipeline entry, and allows per-context colour variants (header vs footer) without duplication of files. Consistent with how the current logo is implemented.
- **Hard-code `fill="#1e40af"` on the logo background rect in both contexts**: The header background is always primary blue and the footer background is also always primary blue — using `currentColor` on the rect would inherit white in the footer (parent text is white). Hard-coding is safer and equally readable.
- **Two-tone wordmark via nested `<span>`**: "Ranamo" keeps the `currentColor` of the parent anchor (blue in header, white in footer); "Edu" gets `text-(--color-accent)` (amber) which works in both contexts.
- **`font-extrabold tracking-tight` for wordmark**: Upgrades from `font-bold` with no letter-spacing, giving a premium feel without introducing any new fonts or CSS.
- **Remove eyebrow labels ("Where Will You Study?", "What We Offer", "The Process")**: These are small `<span>` labels above their respective `<h2>` elements. Removing them is a safe single-element deletion with no layout impact.
- **R34 attribution fix**: The services.astro page has no trust strip with numerical stats. The requirement to update "5,000+" stats is satisfied entirely by R36 on contact.astro. No changes are needed to services.astro's trust strip.

## Open Questions

### Resolved During Planning

- **R34 trust strip location**: The researcher confirmed `services.astro` has no trust strip. The stat updates for services-adjacent content are all covered by R36 on `contact.astro`. Treat R34 as resolved: no trust strip changes needed on services.astro beyond the CTA text changes in R33.
- **Header logo `currentColor` vs hard-coded**: Header background rect should use `fill="#1e40af"` (same as footer) rather than `currentColor`. This is safer because the rect fill is not meant to inherit text colour — only text elements should use `currentColor`.

### Deferred to Implementation

- **Exact SVG visual result**: The paths in the High-Level Technical Design are directional. The implementer should do a quick `yarn dev` preview to confirm the R shape reads clearly at 32px display size and the rocket is recognisable.
- **Hero stats strip text wrapping**: "Dreams Turned Into Reality" is ~26 characters at `text-xs`. The implementer should add `leading-tight` and `max-w-24` to each stat `<div>` to prevent overflow on narrow screens.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Logo SVG — R + Rocket (32×32 viewBox)

The new logo is a stylised flowing R whose leg/tail curves into a small rocket pointing upper-right. All elements use the blue/white/amber palette already established by the site.

```
<svg viewBox="0 0 32 32" fill="none">
  <!-- Blue rounded-square background -->
  <rect width="32" height="32" rx="7" fill="#1e40af"/>

  <!-- R: vertical stem -->
  <path d="M8 25V7"
        stroke="white" stroke-width="2.5" stroke-linecap="round"/>

  <!-- R: bowl (D-shape bump on right) -->
  <path d="M8 7Q17 7 20 9Q22 11 22 13Q22 17 8 17"
        stroke="white" stroke-width="2.5" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- R: leg curving into rocket trail -->
  <path d="M8 17Q12 21 15 24Q18 27 22 26Q25 25 26 21"
        stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Rocket body: ellipse rotated 45° to point upper-right -->
  <ellipse cx="26" cy="20" rx="1.5" ry="2.8"
           transform="rotate(45 26 20)" fill="white"/>

  <!-- Rocket nose (amber, upper-right tip ~28,18) -->
  <circle cx="28" cy="18" r="1" fill="#fbbf24"/>

  <!-- Rocket flame (amber, lower-left base ~24,22) -->
  <circle cx="24" cy="22" r="1.3" fill="#f59e0b" opacity="0.8"/>
</svg>
```

The rotate(45°) on the ellipse places the long axis (ry=2.8) diagonally upper-right, putting the tip at approximately (27.98, 18.02) and the base at (24.02, 21.98) — both within the 32×32 viewport.

### Wordmark

```
<a href="/" class="flex items-center gap-2 font-extrabold text-xl tracking-tight [context-colour]">
  [SVG logo]
  Ranamo <span class="text-(--color-accent)">Edu</span>
</a>
```

- Header `[context-colour]`: `text-(--color-primary)` — "Ranamo" inherits primary blue, "Edu" is amber.
- Footer `[context-colour]`: `text-white` — "Ranamo" inherits white, "Edu" is amber.

## Implementation Units

- [ ] **Unit 1: Header — Logo, Wordmark, Nav, and CTA Buttons**

**Goal:** Replace the globe SVG and plain wordmark in the header, remove Blog and Success Stories from nav, update the desktop CTA button and AI Counselor dialog button.

**Requirements:** R1, R2, R17, R37, R38

**Dependencies:** None

**Files:**
- Modify: `src/components/Header.astro`

**Approach:**
- Replace the 5-path globe SVG (lines 28–35) with the R+rocket SVG per the High-Level Technical Design. Use `fill="#1e40af"` on the rect (not `currentColor`).
- Wrap the wordmark text in a `<span>` split: `Ranamo <span class="text-(--color-accent)">Edu</span>`. Change the anchor classes from `font-bold` to `font-extrabold tracking-tight`.
- Remove `{ href: '/success-stories', label: 'Success Stories' }` and `{ href: '/blog', label: 'Blog' }` from `navLinks` array. This removes both from desktop and mobile menus simultaneously.
- Change the `<Button>` desktop CTA child text from `Free Consultation` → `Book Consultation` (line 72).
- Change the AI Counselor dialog fallback link text from `Book a Free Consultation` → `Book a Consultation` (line 180).

**Patterns to follow:**
- Existing inline SVG pattern in `src/components/Header.astro` lines 28–35
- The `navLinks` array pattern, lines 4–11

**Test scenarios:**
- Happy path: Site loads and the header displays the R+rocket logo at 32px without clipping or overflow
- Happy path: "Ranamo" appears in blue and "Edu" appears in amber in the header
- Happy path: Desktop nav does not show "Success Stories" or "Blog" links
- Happy path: Mobile nav (hamburger open) does not show "Success Stories" or "Blog" links
- Happy path: The desktop "Book Consultation" button links to `/contact`
- Happy path: The AI Counselor dialog shows "Book a Consultation" (no "Free") in the fallback link

**Verification:**
- `yarn build` (or `yarn dev`) completes without errors
- The header renders correctly in both desktop and mobile viewports with no layout breaks

---

- [ ] **Unit 2: Footer — Logo, Wordmark, Brand Description, Social Icons, Nav Links, and Address**

**Goal:** Apply the new logo and wordmark to the footer, update the brand description, remove Facebook and Twitter social icons, remove Blog and Success Stories from quick links, and remove the physical address block.

**Requirements:** R1, R2, R18, R23, R24, R25, R26

**Dependencies:** Unit 1 (logo SVG design established)

**Files:**
- Modify: `src/components/Footer.astro`

**Approach:**
- Replace the 5-path globe SVG (lines 55–61) with the R+rocket SVG. Use `fill="#1e40af"` on the rect (the footer parent is `text-white` so `currentColor` would give white — the hard-coded value is required here).
- Wrap wordmark text: `Ranamo <span class="text-(--color-accent)">Edu</span>`. Parent anchor classes: keep `text-white`, change `font-bold` → `font-extrabold tracking-tight`.
- Replace the footer brand description `<p>` text (line 65) with: `"Explore, compare, and apply to top global universities and courses—powered by AI and guided by expert counsellors."`
- Remove the `X (Twitter)` and `Facebook` entries from the `socialLinks` array (keep Instagram and LinkedIn).
- Remove `{ href: '/success-stories', label: 'Success Stories' }` and `{ href: '/blog', label: 'Blog' }` from `quickLinks` array.
- Remove the `<li class="leading-relaxed">123 MG Road...</li>` block from the Contact column (keep email, phone, and WhatsApp link).

**Patterns to follow:**
- Existing `socialLinks` array with `svg` string + `<Fragment set:html={svg} />` pattern (lines 24–45)
- Existing `quickLinks` array pattern (lines 4–12)

**Test scenarios:**
- Happy path: Footer logo matches the header logo visually (same R+rocket shape, but the background always appears blue regardless of surrounding dark background)
- Happy path: "Ranamo" in footer appears white, "Edu" appears amber
- Happy path: Footer Quick Links do not include "Success Stories" or "Blog"
- Happy path: Social icons show only Instagram and LinkedIn (no Twitter/X or Facebook)
- Happy path: Footer contact column shows email, phone, and WhatsApp but no address block

**Verification:**
- No broken layout in the footer brand column
- Footer social icon row is not empty (Instagram + LinkedIn remain)

---

- [ ] **Unit 3: Hero Section — Copy, Stats, and Card**

**Goal:** Update the hero badge, subtitle, CTA button, stats strip, and the application card to align with AI positioning and corrected social-proof numbers.

**Requirements:** R3, R4, R5, R6, R7, R8

**Dependencies:** None

**Files:**
- Modify: `src/components/sections/Hero.astro`

**Approach:**
- Change badge text: `"Trusted by 5,000+ Students"` → `"Trusted by 2,000+ Students"`.
- Replace hero subtitle `<p>` text with: `"Explore, compare, and apply to top global universities and courses—powered by AI and guided by expert counsellors."`
- Change `<Button>` child text: `"Book Free Consultation"` → `"Book Consultation"`.
- Update the stats array (in the stats strip `{[…].map(…)}`) — four entries:
  ```
  { value: '2,000+', label: 'Dreams Turned Into Reality' }
  { value: '500+',   label: 'Top Universities Worldwide' }
  { value: '15+',    label: 'Countries' }       // unchanged
  { value: '98%',    label: 'Visa Approval Success' }
  ```
  Add `max-w-24` and `leading-tight` to each stat `<div>` to handle longer label text gracefully.
- In the hero card, remove the `<div class="text-blue-200 text-xs">University of Toronto</div>` line.
- Replace the steps array with 5 entries: `['Profile Assessment with AI', 'University Shortlisting', 'Application Submitted', 'Offer Received', 'Visa Filing']`. Keep the checkmark condition `i < 3` (first 3 get ✓). Change the step number for unchecked items from the hard-coded `'4'` to `String(i + 1)` (so step 4 shows "4" and step 5 shows "5").

**Patterns to follow:**
- Existing inline stats array and card steps map patterns in `src/components/sections/Hero.astro`

**Test scenarios:**
- Happy path: Badge shows "2,000+" not "5,000+"
- Happy path: Hero subtitle is the new AI-focused text
- Happy path: CTA button reads "Book Consultation" and links to `/contact`
- Happy path: Stats strip shows four items with updated values/labels; no label overflow on mobile
- Happy path: Hero card shows no "University of Toronto" text
- Happy path: Hero card shows 5 steps — first 3 with green ✓ checkmarks, step 4 shows "4", step 5 shows "5"
- Edge case: Stats strip wraps cleanly at 375px viewport width (long labels truncate or wrap without breaking the flex layout)

**Verification:**
- Hero section renders with all updated values; no clipped or overflowing text visible at 1440px and 375px widths

---

- [ ] **Unit 4: Homepage Middle Sections — Eyebrow Labels, Copy, and Stats**

**Goal:** Update the destinations, services, how-it-works, and stats sections by removing eyebrow labels, updating headings/descriptions, and aligning stat numbers with the rest of the site.

**Requirements:** R9–R16

**Dependencies:** None

**Files:**
- Modify: `src/components/sections/DestinationsStrip.astro`
- Modify: `src/components/sections/ServicesSection.astro`
- Modify: `src/components/sections/HowItWorks.astro`
- Modify: `src/components/sections/StatsSection.astro`

**Approach:**

*DestinationsStrip.astro (R9)*
- Delete the `<span class="text-(--color-primary)...">Where Will You Study?</span>` eyebrow element. The `<h2 id="destinations-heading">` becomes the first visible element in the text block.

*ServicesSection.astro (R10, R11, R12)*
- Delete the `<span class="text-(--color-primary)...">What We Offer</span>` eyebrow.
- Change `<h2>` text: `"Comprehensive Study Abroad Services"` → `"Why We're the Best Choice"`.
- Change `<p>` text: update to `"We combine technology, expertise, and a student-first mindset to make studying abroad simpler, smarter, and more successful."`

*HowItWorks.astro (R13, R14, R15)*
- Delete the `<span class="text-(--color-primary)...">The Process</span>` eyebrow.
- Update the Step 01 object: `title: 'AI-Powered Profile Assessment'`; `desc: 'Our AI analyzes your academics, test scores, budget, and career goals to build a comprehensive picture of your potential.'`
- Update the section sub-description: change `"5,000+ students"` → `"2,000+ students"`.

*StatsSection.astro (R16)*
- Update the `stats` array:
  ```
  { value: 2000, suffix: '+', label: 'Dreams Turned Into Reality', desc: 'Across 15+ countries' }
  { value: 500,  suffix: '+', label: 'Top Universities Worldwide',  desc: 'Top-ranked institutions' }
  { value: 98,   suffix: '%', label: 'Visa Approval Success',       desc: 'Student visa approvals' }
  { value: 500,  suffix: '+', label: 'Scholarships Rewarded',       desc: 'Worth ₹50+ crore' }
  ```
  The `data-stat-target` attribute on the counter animation reads from these values — no script changes needed; the existing IntersectionObserver animation works correctly with any integer value.

**Patterns to follow:**
- The inline `const steps = [...]` pattern in `HowItWorks.astro`
- The inline `const stats = [...]` pattern in `StatsSection.astro`

**Test scenarios:**
- Happy path: Destinations section shows "Top Study Destinations" as the first heading with no eyebrow above it
- Happy path: Services section shows "Why We're the Best Choice" heading with new description
- Happy path: How It Works shows no "The Process" eyebrow; Step 1 title is "AI-Powered Profile Assessment"
- Happy path: Stats section counter animation counts to 2000, 500, 98, 500 respectively
- Happy path: Stats section labels are "Dreams Turned Into Reality", "Top Universities Worldwide", "Visa Approval Success", "Scholarships Rewarded"
- Integration: Stats counter animation completes without JS errors on page scroll (IntersectionObserver still fires correctly)

**Verification:**
- All four section headings and descriptions match requirements; no eyebrow labels present
- Stats counter animation runs on scroll in a browser preview

---

- [ ] **Unit 5: CTA Section and Homepage Cleanup**

**Goal:** Update the CTA section copy and trust badges; remove Testimonials and BlogTeaser from the homepage.

**Requirements:** R19, R20, R21, R22

**Dependencies:** None

**Files:**
- Modify: `src/components/sections/CTASection.astro`
- Modify: `src/pages/index.astro`

**Approach:**

*CTASection.astro (R20, R21, R22)*
- Change both CTA button labels: `"Book Free Consultation"` → `"Book Consultation"` (there is one primary button linking to `/contact`).
- Replace the section description `<p>` text: `"Book a free 30-minute consultation…"` → `"Book a consultation with our expert counselors. Get instant, personalized AI-powered advice on the right universities, countries, and scholarships for your profile."`
- Update the three trust badge `<span>` elements:
  - `"Free consultation"` → `"AI-Guided Counseling"`
  - `"No obligation"` — unchanged
  - `"Response within 24 hours"` → `"Instant Response"`

*index.astro (R19)*
- Delete the `import Testimonials` line.
- Delete the `import BlogTeaser` line.
- Delete the `<Testimonials />` JSX tag.
- Delete the `<BlogTeaser />` JSX tag.
- No other changes to index.astro; all remaining section imports and tags stay.

**Patterns to follow:**
- Existing trust badge `<span>` pattern in `CTASection.astro` (lines 37–48)
- Existing import block in `src/pages/index.astro`

**Test scenarios:**
- Happy path: CTA section shows "Book Consultation" button (no "Free")
- Happy path: CTA description contains "AI-powered advice"
- Happy path: Three trust badges read "AI-Guided Counseling", "No obligation", "Instant Response"
- Happy path: Homepage renders without Testimonials or BlogTeaser sections
- Integration: `yarn build` completes without errors after removing the two component imports (no dead import warnings)

**Verification:**
- Homepage scrolled top-to-bottom shows: Hero → Destinations → Services → HowItWorks → Stats → UniversityLogos → CTA → FAQ (Testimonials and BlogTeaser sections are absent)

---

- [ ] **Unit 6: About Page — Hero, Mission, Stats, and Section Removal**

**Goal:** Update the About page hero subtitle, rewrite the mission body, correct the student count stat, and remove the Meet the Team and Accreditations sections entirely.

**Requirements:** R27, R28, R29, R30, R31, R32

**Dependencies:** None

**Files:**
- Modify: `src/pages/about.astro`

**Approach:**
- Change hero `<p>` subtitle (line 39): `"Empowering Indian students to access world-class education since 2015."` → `"Empowering Indian students to access world-class education through AI-powered guidance and expert counseling."`
- Replace the three mission body `<p>` elements (lines 49–58) with exactly two paragraphs:
  > "We are on a mission to revolutionize the way students pursue their study abroad journey by combining the power of AI with the expertise of experienced counsellors. Our platform simplifies complex decisions and empowers students with the right insights to confidently choose their future."
  >
  > "With a strong student-first approach, we are committed to delivering exceptional service and ensuring a smooth, transparent, and stress-free experience for every student."
- In the stats grid `{[...].map(...)}` (lines 61–70), change the first entry's `value` from `'5,000+'` → `'2,000+'`.
- Delete the entire `<section class="py-20 bg-white">` Meet the Team block (lines 76–96), including the `const team = [...]` array in the frontmatter.
- Delete the entire `<section class="py-16 bg-(--color-bg) border-t...">` Accreditations block (lines 98–110).
- Update the About page CTA section (lines 113–121): change sub-copy `"Book a free consultation with our team today."` → `"Book a consultation with our team today."` and button label `"Book Free Consultation →"` → `"Book Consultation →"`.
- Update the `<BaseLayout description="...">` prop (line 24) to: `"Learn about Ranamo Edu — AI-powered study abroad consulting helping Indian students access world-class education. Expert counselors, 2,000+ students placed."`

**Patterns to follow:**
- Inline stats grid array pattern (lines 61–70)
- Existing `<BaseLayout>` usage pattern

**Test scenarios:**
- Happy path: About hero shows new AI-focused subtitle
- Happy path: Mission section shows exactly two new paragraphs (old three paragraphs are gone)
- Happy path: Stats grid shows "2,000+" for Students Placed
- Happy path: Scrolling the About page does not show a Team section or Accreditations section
- Happy path: About page CTA button reads "Book Consultation →"
- Edge case: About page still renders correctly with the team `const` array deleted from frontmatter (no references to `team` should remain)

**Verification:**
- About page loads and scrolls cleanly; only sections present are Hero → Mission → CTA

---

- [ ] **Unit 7: Services and Contact Pages — CTA Text and Stats**

**Goal:** Remove "Free" from Services page CTA; update Contact page hero subtitle and trust strip stats.

**Requirements:** R33, R35, R36

**Dependencies:** None

**Files:**
- Modify: `src/pages/services.astro`
- Modify: `src/pages/contact.astro`

**Approach:**

*services.astro (R33)*
- Change the services CTA heading (line 87): `"Get Started with a Free Consultation"` → `"Get Started with a Consultation"`.
- Change the services CTA button label (line 90): `"Book Free Consultation →"` → `"Book Consultation →"`.

*contact.astro (R35, R36)*
- Change hero subtitle `<p>` (lines 52–54): `"Book a free consultation or drop us a message. Our counselors will respond within 24 hours."` → `"Book a consultation or drop us a message. Our AI-powered platform and expert counselors are ready to help."`
- Update the trust strip (lines 163–183):
  - `"5,000+"` → `"2,000+"` (Students Placed)
  - `"Free"` / `"Initial Consultation"` → `"Expert"` / `"Consultation"` (or equivalently: change the value div to "Expert" and the label div to "Consultation")
  - `"24hr"` / `"Response Time"` → `"Instant"` / `"Response"`
- Update the `<BaseLayout description="...">` (line 37) to remove "free": `"Get in touch with Ranamo Edu — book a study abroad consultation, or send us a message. Our AI-powered platform responds instantly."`

**Patterns to follow:**
- Existing trust strip markup pattern in `contact.astro` lines 163–183

**Test scenarios:**
- Happy path: Services page CTA reads "Get Started with a Consultation" and "Book Consultation →"
- Happy path: Contact page hero subtitle contains new AI-focused text (no "free", no "24 hours")
- Happy path: Contact page trust strip shows "2,000+", "Expert Consultation", "Instant Response"

**Verification:**
- Both pages load without errors; CTA text matches requirements on visual inspection

---

## System-Wide Impact

- **Navigation consistency**: After Unit 1 and Unit 2, Blog and Success Stories links are absent from all nav surfaces (header desktop, header mobile, footer quick links). The underlying pages still exist and remain accessible via direct URL.
- **"Free" removal blast radius**: After all units complete, no public-facing text on in-scope pages should contain "Free Consultation". The blog post body (`src/content/blog/`) retains a free-consultation link — this is explicitly out of scope.
- **Stats consistency**: After Units 3, 4, 6, and 7, the social-proof numbers are consistent: 2,000+ students, 500+ universities, 98% visa approval, 500+ scholarships, across Hero, StatsSection, About, and Contact pages.
- **AI positioning**: After all units, AI is naturally present in: hero subtitle (R4), hero card step 1 (R8), HowItWorks step 1 (R14), CTA description (R21), CTA trust badge (R22), footer description (R24), about hero (R27), about mission (R28) — 8 touchpoints without feeling repetitive.
- **Unchanged invariants**: The AI Counselor placeholder dialog, WhatsApp button, contact form Netlify integration, destinations data, services data, blog/success-stories page content, and all SEO structure remain unchanged.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| SVG rocket illegible at 32px display size | Implementer should preview in browser at 1x and 2x; if illegible, simplify the rocket to an ellipse + circle (no flame) |
| "Dreams Turned Into Reality" label overflows hero stats strip on mobile | Add `max-w-24 leading-tight` to stat `<div>`; test at 375px viewport |
| Deleting `const team = [...]` while `team` is still referenced in template causes build error | Delete both the `const team` array and its `{team.map(...)}` JSX block in the same edit pass |
| Two `500+` values in StatsSection (Universities and Scholarships) | Intentional per requirements; the labels differentiate them clearly |
| Astro build may warn on removed imports | Delete both the import line and the JSX tag for Testimonials and BlogTeaser in the same pass |

## Documentation / Operational Notes

- No SEO redirects needed — no pages are deleted or moved.
- No Netlify configuration changes needed.
- After go-live, verify the Contact page trust strip renders correctly in production (it has bespoke markup, not a shared component).

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-10-website-refresh-requirements.md](docs/brainstorms/2026-05-10-website-refresh-requirements.md)
- Related plan: [docs/plans/2026-05-03-001-feat-ai-counselor-placeholder-plan.md](docs/plans/2026-05-03-001-feat-ai-counselor-placeholder-plan.md)
- Inline SVG logo patterns: `src/components/Header.astro` lines 28–35, `src/components/Footer.astro` lines 55–61
- Stats counter animation: `src/components/sections/StatsSection.astro` inline `<script>` block
