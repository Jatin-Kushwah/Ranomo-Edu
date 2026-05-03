---
date: 2026-05-03
topic: ai-counselor-placeholder
---

# AI Counselor — Temporary Unavailability Placeholder

## Problem Frame

Ranamo Edu wants to signal that an AI Study Counselor is a live, real capability of the product — not a future promise. The feature itself (the actual chatbot) is temporarily offline. Without any entry point, returning visitors or new users who heard about the AI feature will assume it doesn't exist or was abandoned. The goal is to surface the AI Counselor as a credible, working product feature that happens to be briefly unavailable right now — and to redirect users toward a human counselor in the meantime.

## User Flow

```
                ┌──────────────────────────────┐
                │  User visits any page         │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │  Sees "AI Counselor" button   │
                │  in header nav               │
                └──────────────┬───────────────┘
                               │  clicks
                               ▼
                ┌──────────────────────────────┐
                │  Modal opens                 │
                │  • AI Counselor header       │
                │  • Amber "maintenance" badge  │
                │  • Professional message       │
                │  • WhatsApp CTA              │
                │  • Free Consultation CTA     │
                │  • Close (×) button          │
                └──────────────┬───────────────┘
                               │  clicks CTA or ×
                               ▼
                ┌──────────────────────────────┐
                │  Dismissed / redirected       │
                └──────────────────────────────┘
```

## Requirements

**Header Entry Point**
- R1. Add an "AI Counselor" button to the header, placed to the left of the existing "Free Consultation" button in the desktop CTA area.
- R2. The button carries a small sparkle or bot icon and a subtle amber status badge (dot) indicating the feature is currently paused — not broken, not absent.
- R3. On mobile, the button appears as a nav item inside the existing mobile drawer (below the current nav links), using the same row style as other nav items.
- R4. The button uses a visual treatment distinct from the primary "Free Consultation" button — e.g., outline or ghost variant with an amber accent — so the two CTAs have clear visual hierarchy without either being buried.

**Modal**
- R5. Clicking the button opens a centered modal overlay using a native `<dialog>` element for accessibility and simplicity.
- R6. The modal heading is "AI Counselor" with a sparkle icon, matching the button.
- R7. The modal displays a professional status indicator: an amber dot labeled "Temporarily Unavailable" or "Under Maintenance" — phrased to imply the service normally runs and will return.
- R8. The body copy frames the situation as routine maintenance, not a missing feature. Suggested: *"Our AI Study Counselor is currently undergoing maintenance to serve you better. Our expert counselors are available right now to answer your questions."*
- R9. The modal offers two fallback CTAs: **Chat on WhatsApp** (links to the existing WhatsApp number) and **Book a Free Consultation** (links to `/contact`).
- R10. The modal has a close button (×) in the top-right corner. Clicking outside the modal (on the backdrop) also closes it.
- R11. Modal is fully responsive — usable on mobile, centered vertically and horizontally, with appropriate padding.

**Design & Integration**
- R12. All colors, typography, radius, and shadow values must come from the existing design tokens in `src/styles/global.css` — no new tokens introduced.
- R13. The implementation must not break the existing sticky header, CSS-only hamburger menu, or `transition:persist` behavior.
- R14. The modal trigger uses a minimal inline `<script>` (or a CSS-only approach where viable) — no new npm packages.

## Success Criteria
- A user landing on any page sees the AI Counselor entry point without it feeling like a placeholder or stub.
- A user who clicks the button reads the message and does not conclude the feature was abandoned or never built.
- A user who clicks either fallback CTA is correctly routed to WhatsApp or the contact page.
- The header layout is not broken on desktop (≥1024px), tablet (640–1023px), or mobile (<640px).

## Scope Boundaries
- The actual AI chatbot integration is out of scope — no backend, no API calls, no chat UI.
- No new pages are introduced — the interaction is entirely contained in the modal.
- No analytics or event tracking is in scope for this iteration.
- The "maintenance" state is hardcoded — there is no toggle, config flag, or CMS field to flip the feature live. That belongs to a future implementation ticket.

## Key Decisions
- **Header over floating button**: Places AI Counselor at the same tier as the primary CTA ("Free Consultation"), signaling it is a real product feature rather than an add-on.
- **Modal over dedicated page**: Keeps the interaction lightweight, avoids creating an empty-feeling page, and lets users act (WhatsApp / consult) without a full navigation step.
- **Maintenance framing over "coming soon"**: "Coming soon" or "under development" signals the feature doesn't exist yet. "Under maintenance" signals it exists and will return.
- **Two fallback CTAs**: Covers both intent profiles — users who want immediate contact (WhatsApp) and users willing to schedule (Free Consultation).

## Outstanding Questions

### Deferred to Planning
- [Affects R5][Technical] Should the modal use a native `<dialog>` + small inline script, or a CSS-only checkbox trick (like the hamburger)? The `<dialog>` approach is more accessible (`aria-modal`, focus trapping) but requires a few lines of JS.
- [Affects R2, R4][Technical] Exact button variant — the outline variant from `Button.astro` fits, but an amber-tinted ghost may read better alongside the blue "Free Consultation". Confirm during implementation.

## Next Steps
→ `/ce:plan` for structured implementation planning
