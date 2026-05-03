---
title: feat: Add AI Counselor placeholder to header
type: feat
status: completed
date: 2026-05-03
origin: docs/brainstorms/2026-05-03-ai-counselor-placeholder-requirements.md
---

# feat: Add AI Counselor Placeholder to Header

## Overview

Add an "AI Counselor" button to the site header that opens a native `<dialog>` modal showing a professional maintenance message and two fallback CTAs (WhatsApp and Free Consultation). The button appears on every page via the persisted header, the interaction is entirely self-contained in `src/components/Header.astro`, and no new pages or packages are introduced.

## Problem Frame

Ranamo Edu wants users to perceive the AI Study Counselor as a live product feature that is temporarily offline — not a future promise or an abandoned stub. Without a visible entry point, users who expect or have heard about the AI feature may assume it was never built or has been dropped. (see origin: docs/brainstorms/2026-05-03-ai-counselor-placeholder-requirements.md)

## Requirements Trace

- R1. "AI Counselor" button placed in header desktop CTA area, left of "Free Consultation"
- R2. Sparkle icon + amber status dot on the button
- R3. Mobile drawer nav item for AI Counselor
- R4. Visually distinct treatment from the primary blue "Free Consultation" button
- R5. Native `<dialog>` element for the modal overlay
- R6. Modal heading "AI Counselor" with sparkle icon
- R7. Amber maintenance status indicator in modal
- R8. Professional body copy framing situation as routine maintenance
- R9. Two fallback CTAs — WhatsApp and Free Consultation
- R10. Close via × button, backdrop click, or Escape key
- R11. Fully responsive modal
- R12. All design tokens from `src/styles/global.css` only — no new tokens
- R13. No breakage to sticky header, CSS-only hamburger, or `transition:persist`
- R14. No new npm packages

## Scope Boundaries

- No actual AI chatbot integration — no backend, no API calls, no chat UI
- No new pages — interaction is entirely contained in the modal
- No analytics or event tracking
- The maintenance state is hardcoded — no config flag to flip the feature live

## Context & Research

### Relevant Code and Patterns

- `src/components/Header.astro` — target file; contains sticky header with CSS-only hamburger (`#nav-toggle` checkbox peer pattern), desktop nav + CTA area (`<div class="flex items-center gap-3">`), and mobile drawer `<nav>`
- `src/components/ui/Button.astro` — three variants: `primary` (solid blue), `outline` (blue border), `ghost`; accepts arbitrary props via `...rest`; use `type="button"` for non-link buttons
- `src/components/ui/Badge.astro` — `accent` variant (`bg-amber-100 text-amber-800`) fits the amber maintenance badge in the modal
- `src/components/sections/ContactForm.astro` and `src/components/sections/StatsSection.astro` — establish the inline `<script>` pattern: define a named init function, call immediately, re-register via `document.addEventListener('astro:after-swap', fn)`
- `src/components/WhatsAppButton.astro` — WhatsApp number is `917389027489`; message: `Hello! I'm interested in studying abroad. Could you help me?`
- `src/styles/global.css` — relevant tokens: `--color-accent` (#f59e0b amber), `--color-accent-dark` (#d97706), `--color-dark` (#0f172a), `--color-border` (#e2e8f0), `--shadow-xl`, `--radius-lg` (1rem)

### Institutional Learnings

- None — `docs/solutions/` does not yet exist in this repo

## Key Technical Decisions

- **Native `<dialog>` + inline script over CSS-only checkbox trick**: The native `<dialog>` element renders in the browser's top layer — above all CSS stacking contexts including the header's `z-40` and WhatsApp button's `z-50` — so no z-index management is needed. Focus trapping and Escape key dismissal are built in. The CSS-only alternative would add a second `<input type="checkbox">` to the header, risking interference with the `#nav-toggle:checked ~ * .nav-bar-N` CSS combinator that drives the hamburger animation. (see origin: R5, R14)

- **`<dialog>` placed inside `<header>` (after mobile drawer)**: The header carries `transition:persist`, meaning its DOM survives page-to-page View Transitions. A dialog placed outside the header (e.g., appended to `<body>`) would be torn down and recreated on every swap. Placement must be after the mobile drawer `</div>` — inserting between the `<input#nav-toggle>` and the drawer would break the `peer-checked:` sibling selector chain. (see origin: R13)

- **Inline amber `<button>` styles (not Button.astro)**: The trigger needs amber accent color and an inline status dot that don't map to any existing Button variant. A custom raw `<button>` element in the header avoids misusing Button.astro with override classes that create Tailwind v4 specificity edge cases, and keeps the implementation self-contained. (see origin: R4)

- **Close on `astro:before-swap`**: When a user clicks the "Book a Free Consultation" CTA inside the modal, a View Transition begins. The modal must close before the swap animates so it doesn't appear open on the destination page. `document.addEventListener('astro:before-swap', () => dialog?.close())` handles this cleanly. (see origin: R13)

- **No `astro:after-swap` re-registration for dialog**: With `transition:persist` on the header, the dialog DOM and its JavaScript event listeners survive page swaps intact — unlike components that are replaced on swap. Re-registering on `astro:after-swap` would add duplicate listeners. The `astro:before-swap` close listener is sufficient.

- **Mobile entry point in drawer, not floating**: Per R3, the mobile nav row in the drawer matches the visual hierarchy of existing mobile nav links. The desktop amber button is hidden below `sm:` breakpoint; the mobile entry lives in the drawer exclusively.

## Open Questions

### Resolved During Planning

- **`<dialog>` vs CSS-only checkbox**: Native `<dialog>` — see Key Technical Decisions above.
- **Button variant**: Inline amber `<button>` rather than Button.astro variant override — see Key Technical Decisions above.

### Deferred to Implementation

- **Exact sparkle SVG path**: Any standard 4-point sparkle or stars SVG (~16×16px, `aria-hidden="true"`). A simple four-point star shape works; can be sourced from public SVG icon sets or handcrafted with `<path>`.
- **Backdrop click detection**: The standard `dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); })` pattern should work reliably for the native `<dialog>` backdrop. Confirm during implementation.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
src/components/Header.astro — modified structure

<header transition:persist z-40>
  <div>  ← main bar
    [Logo]
    <nav> ← desktop nav links (unchanged) </nav>
    <div class="flex items-center gap-3">
      <button id="ai-counselor-btn" class="hidden sm:inline-flex amber-styles">
        [sparkle svg] AI Counselor [amber dot]
      </button>
      <Button href="/contact" variant="primary"> ← unchanged
        Free Consultation
      </Button>
      <label for="nav-toggle"> ← unchanged hamburger </label>
    </div>
  </div>

  <input id="nav-toggle" class="hidden peer" />  ← unchanged

  <div class="peer-checked:max-h-[500px] ...">  ← unchanged mobile drawer
    <nav>
      [existing nav links — unchanged]
      <button id="ai-counselor-btn-mobile" class="amber mobile-nav-row-styles">
        [sparkle svg] AI Counselor [amber dot]
      </button>
    </nav>
  </div>

  <!-- NEW: placed after drawer, inside header for transition:persist -->
  <dialog id="ai-counselor-dialog">
    <div class="modal-card">
      <header row>  [sparkle] AI Counselor (h2)   [× close button]  </header>
      <badge row>   [amber dot] Under Maintenance                    </badge>
      <p> body copy — maintenance framing </p>
      <div class="cta-row">
        <Button href="wa.me/..." target="_blank">Chat on WhatsApp</Button>
        <Button href="/contact" variant="outline">Book a Free Consultation</Button>
      </div>
    </div>
  </dialog>

  <style> dialog::backdrop { background: rgba(0,0,0,0.5); } </style>

  <script>
    function initAiCounselorDialog() {
      const dialog = document.getElementById('ai-counselor-dialog');
      const triggers = ['ai-counselor-btn', 'ai-counselor-btn-mobile'];
      // open on trigger click
      // close on × button click
      // close on backdrop click (e.target === dialog)
    }
    initAiCounselorDialog();
    document.addEventListener('astro:after-swap', initAiCounselorDialog);
    document.addEventListener('astro:before-swap', () => dialog?.close());
  </script>
</header>
```

## Implementation Units

- [ ] **Unit 1: AI Counselor trigger buttons (desktop + mobile)**

**Goal:** Surface the AI Counselor as a visible entry point in the header on all pages at both desktop and mobile breakpoints.

**Requirements:** R1, R2, R3, R4

**Dependencies:** None

**Files:**
- Modify: `src/components/Header.astro`

**Approach:**
- In the desktop CTA `<div class="flex items-center gap-3">`, insert a raw `<button id="ai-counselor-btn">` before the Free Consultation `<Button>`. Apply `class="hidden sm:inline-flex"` to hide it below the `sm` breakpoint (matching the existing "Free Consultation" visibility pattern). Style with amber text (`text-(--color-accent)`), transparent background, hover amber tint (`hover:bg-amber-50`), matching rounded-lg, font-semibold, text-sm base. Include a 16×16 inline sparkle SVG (`aria-hidden="true"`) and a small amber status dot (`h-2 w-2 rounded-full bg-(--color-accent)`) as a visual indicator.
- In the mobile drawer `<nav>`, add a `<button id="ai-counselor-btn-mobile">` as the last item, after the last existing nav link. Mirror the mobile nav link styles (`px-4 py-3 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-50`). Include the same sparkle SVG and amber dot inline.

**Patterns to follow:**
- Desktop CTA area: `src/components/Header.astro` lines 56–71
- Mobile nav item styling: `src/components/Header.astro` lines 79–93
- Amber color token: `--color-accent` in `src/styles/global.css`

**Test scenarios:**
- Happy path: AI Counselor button is visible in the desktop header at ≥640px viewport; "Free Consultation" appears to its right
- Happy path: AI Counselor nav row is visible in the mobile drawer when hamburger is toggled open at <640px
- Happy path: AI Counselor button is NOT visible in the main header bar at mobile (<640px) — only in the drawer
- Edge case: "Free Consultation" button remains the visually dominant CTA — amber ghost treatment reads as secondary to solid blue primary
- Edge case: Hamburger animation (bar-1 rotates, bar-2 fades, bar-3 rotates) is not affected by the new elements

**Verification:**
- Header layout intact at desktop (≥1024px), tablet (640–1023px), and mobile (<640px)
- AI Counselor button appears left of "Free Consultation" on desktop
- No visual regression on the hamburger toggle behavior
- Clicking either AI Counselor button does nothing yet (wired in Unit 2)

---

- [ ] **Unit 2: Maintenance modal and interaction script**

**Goal:** Clicking either AI Counselor trigger opens a polished maintenance dialog with body copy, amber status indicator, and two fallback CTAs. Dialog closes on × button, backdrop click, Escape key, and before any View Transition page swap.

**Requirements:** R5, R6, R7, R8, R9, R10, R11, R12, R13, R14

**Dependencies:** Unit 1 (button IDs `ai-counselor-btn` and `ai-counselor-btn-mobile` must exist)

**Files:**
- Modify: `src/components/Header.astro`

**Approach:**
- Add `<dialog id="ai-counselor-dialog">` as the last child of `<header>`, after the mobile drawer `</div>` closing tag. This avoids inserting between `<input#nav-toggle>` and the drawer, which would disrupt the `peer-checked:` sibling selector.
- Inner card layout: `max-w-md w-full mx-auto`, `rounded-(--radius-lg)`, `shadow-(--shadow-xl)`, white background, `p-6` padding.
- Header row: sparkle SVG icon + `<h2>` "AI Counselor", close `<button id="ai-counselor-close">` (×) right-aligned (`ml-auto`).
- Status row: amber dot (`h-2.5 w-2.5 rounded-full bg-(--color-accent) inline-block`) + text "Under Maintenance" in amber. Alternatively, use `<Badge variant="accent">` from `src/components/ui/Badge.astro` wrapping the text with an inline dot prefix.
- Body `<p>`: "Our AI Study Counselor is currently undergoing maintenance to serve you better. Our expert counselors are available right now to answer your questions."
- CTA row: two `<Button>` components — `href="https://wa.me/917389027489?text=Hello%21+I%27m+interested+in+studying+abroad.+Could+you+help+me%3F"` with `target="_blank" rel="noopener noreferrer"` (WhatsApp, `variant="primary"`), and `href="/contact"` (Free Consultation, `variant="outline"`).
- Add scoped `<style>` for `dialog::backdrop { background: rgba(0, 0, 0, 0.5); }` and centering styles for the `<dialog>` element itself.
- Add `<script>` block:
  1. Named `function initAiCounselorDialog()` — queries `#ai-counselor-dialog`, `#ai-counselor-btn`, `#ai-counselor-btn-mobile`, `#ai-counselor-close`; adds click listeners to both trigger buttons to call `dialog.showModal()`; adds click listener for × close; adds backdrop-click close via `e.target === dialog` check.
  2. Register `document.addEventListener('astro:before-swap', () => { document.getElementById('ai-counselor-dialog')?.close(); })` to dismiss before any page navigation.
  3. Call `initAiCounselorDialog()` immediately on load. **Do not** register on `astro:after-swap` — the header has `transition:persist`, so the dialog DOM and all attached event listeners survive page swaps intact. Re-registering would create duplicate listeners.
  4. Wrap in `try/catch` for graceful degradation.

**Patterns to follow:**
- Inline script structure: `src/components/sections/ContactForm.astro` (inline `<script>` with named init function); note: unlike ContactForm, do NOT register on `astro:after-swap` since the header persists
- CTA button usage: `src/components/sections/CTASection.astro` (WhatsApp + contact pattern)
- Design tokens: `src/styles/global.css`
- Badge usage: `src/components/ui/Badge.astro` (`accent` variant)

**Test scenarios:**
- Happy path: Clicking "AI Counselor" desktop button opens the dialog modal, centered on screen with dark backdrop
- Happy path: Clicking "AI Counselor" mobile drawer button also opens the dialog
- Happy path: Modal shows sparkle icon, "AI Counselor" h2, amber "Under Maintenance" badge, body copy, and two CTA buttons
- Happy path: Clicking × button closes the modal
- Happy path: Clicking outside the modal (on the backdrop) closes it
- Happy path: Pressing Escape key closes the modal (native `<dialog>` behavior)
- Happy path: "Chat on WhatsApp" link opens WhatsApp in a new tab; current page stays open
- Happy path: "Book a Free Consultation" navigates to /contact; modal is not visible on arrival
- Edge case: Opening modal, pressing Escape, then re-triggering — modal opens cleanly a second time
- Edge case: Opening modal from any non-home page (e.g. /about, /destinations) — works correctly via transition:persist
- Edge case: No z-index conflict with the WhatsApp floating button (z-50) — dialog top-layer renders above it
- Integration: After a View Transition page swap, the header persists and both trigger buttons still open the modal correctly

**Verification:**
- Modal renders correctly at mobile (<640px: full-width with `mx-4` margin) and desktop (max-w-md centered)
- No z-index conflicts with header (z-40) or WhatsApp button (z-50)
- Existing hamburger, nav, and "Free Consultation" CTA are not affected
- All four close mechanisms work: × button, backdrop click, Escape key, View Transition swap

## System-Wide Impact

- **Interaction graph:** The header has `transition:persist` — the dialog and its event listeners survive all page navigations site-wide. The `astro:before-swap` listener closes the dialog before any swap, preventing it from appearing open on arrival.
- **Unchanged invariants:** CSS-only hamburger toggle (`#nav-toggle` checkbox + `peer-checked:` classes), `transition:persist` behavior, sticky header z-index (z-40), and WhatsApp button (z-50) are all preserved.
- **Integration coverage:** Key cross-layer scenario: user clicks "Book a Free Consultation" inside the modal → View Transition fires → `astro:before-swap` listener closes dialog → header persists to /contact page with dialog closed.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Adding a DOM sibling after mobile drawer breaks hamburger CSS selectors | Verified safe: `#nav-toggle:checked ~ * .nav-bar-N` matches `.nav-bar-N` descendants only; dialog has none. `peer-checked:` on drawer is unaffected by a following sibling. |
| `<dialog>` placed outside `transition:persist` header gets torn down on page swap | Mitigated by design: dialog is a child of `<header transition:persist>`. |
| Modal visible during View Transition to a new page | Mitigated by `astro:before-swap` listener calling `dialog.close()` before the swap animates. |
| Duplicate event listeners from multiple `initAiCounselorDialog()` calls | Non-issue: `astro:after-swap` registration is omitted since `transition:persist` keeps listeners alive. Only the initial page load calls the init function. |

## Documentation / Operational Notes

- When the real AI chatbot is ready to launch, remove the `<dialog>` and `<script>` from `Header.astro` and replace the trigger button's behavior with the actual chat widget initialization.
- The hardcoded maintenance state is intentional per scope (see origin doc). No config flag exists to flip this live — the whole placeholder must be replaced.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-03-ai-counselor-placeholder-requirements.md](docs/brainstorms/2026-05-03-ai-counselor-placeholder-requirements.md)
- Related code: `src/components/Header.astro`, `src/components/ui/Badge.astro`, `src/components/sections/ContactForm.astro`, `src/components/sections/CTASection.astro`
