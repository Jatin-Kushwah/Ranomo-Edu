---
date: 2026-05-19
type: feat
status: active
origin: docs/brainstorms/2026-05-19-ranamobot-requirements.md
---

# feat: Add RanamoBot AI Chat Widget

## Problem Frame

The "AI Counselor" button in the site header opens a maintenance modal — a dead end for visitors who want instant answers about study abroad. The standalone `WhatsAppButton.astro` creates a competing floating element at the same bottom-right position. This plan replaces both with a single, industry-standard floating chat widget (RanamoBot) powered by Google Gemini 2.5 Flash via a Netlify serverless function.

(see origin: `docs/brainstorms/2026-05-19-ranamobot-requirements.md`)

## Requirements Traceability

| Req | Handled by |
|-----|-----------|
| R1 – floating bubble, z-60+ | Unit 2 |
| R2 – remove standalone WhatsApp button | Unit 3 |
| R3 – bubble opens chat panel | Unit 2 |
| R4 – header buttons trigger widget | Unit 4 |
| R5 – remove maintenance dialog | Unit 4 |
| R6 – panel dimensions (380px / full-width mobile) | Unit 2 |
| R7 – panel header (avatar, name, online dot, close) | Unit 2 |
| R8 – persistent footer CTAs | Unit 2 |
| R9 – message alignment + bot avatar | Unit 2 |
| R10 – typing indicator | Unit 2 |
| R11 – send on Enter / disabled when empty | Unit 2 |
| R12 – welcome message on first open | Unit 2 |
| R13 – quick-reply chips | Unit 2 |
| R14 – chip submits message, chips disappear | Unit 2 |
| R15 – Gemini via Netlify Function, key server-side | Unit 1 |
| R16 – system prompt with destinations + services | Unit 1 |
| R17 – escalate personal queries to consultation | Unit 1 |
| R18 – no fabricated stats beyond data files | Unit 1 |
| R19 – history persists across view transitions | Unit 2 |
| R20 – conversation history forwarded per request | Unit 1 + Unit 2 |

## Key Decisions

- **`@google/genai` v2.4.0+, model `gemini-2.5-flash`** — `@google/generative-ai` is EOL (Aug 31 2025); `gemini-1.5-flash` is removed. Use the current SDK and model. (see origin: Key Decisions)
- **Netlify `config.rateLimit` export** — Stateless function instances can't share an in-memory `Map`. Netlify's native rate limiting (`windowLimit: 20, windowSize: 60, aggregateBy: ["ip","domain"]`) works on the free tier and requires no external store. Per-IP throttling is handled automatically.
- **`transition:persist="chat-widget"` with explicit name** — Required to prevent Astro from treating two renders of the same component as different elements during view transitions. Chat state (messages, open/closed) lives in JS module scope on the persisted element.
- **`window.dispatchEvent(new CustomEvent('chat:open'))` for cross-component communication** — Header and widget are separate Astro components with separate `<script>` blocks. Custom events on `window` are the correct decoupled pattern; no shared module import needed.
- **`astro:page-load` for header button re-attachment** — The header uses `transition:persist` so its DOM is never re-created; however, the script block runs once. Re-attaching listeners on `astro:page-load` covers the case where the element is re-used across navigations.
- **History cap: last 40 messages** — Prevents payload bloat and latency creep while preserving sufficient context for a study-abroad Q&A session (20 full exchanges). Expressed uniformly as array length: `messages.slice(-40)`. Do not mix "turns" and "messages" framing in implementation — use 40 as the single cap number.
- **CORS: conditional reflection, `Vary: Origin`** — Base allowlist: `["https://ranomoedu.com", "http://localhost:4321"]`. Netlify also sets `DEPLOY_URL` per deploy (e.g., `https://deploy-preview-42--ranomoedu.netlify.app`) — add this at module init if present so deploy previews work. Never wildcard. Add `Vary: Origin` so CDN caches do not serve the wrong CORS header to different origins.
- **System prompt built at module init** — Import `../../src/data/destinations.ts` and `../../src/data/services.ts` directly. Netlify bundles with esbuild; plain TypeScript with no Astro-specific syntax is safe to import from a function.
- **`dvh` units for mobile panel height** — `max-h-[calc(100dvh-7rem)]` prevents the message area from being clipped by the on-screen keyboard on mobile. `dvh` is the dynamic viewport height unit that accounts for browser chrome.
- **Friendly error fallback** — On API error (network, 429, 500), the bot sends a hardcoded fallback message pointing users to WhatsApp/Book Consultation rather than showing a raw error.

## Architecture Overview

```
Browser
  ├── RanamoBot.astro (transition:persist="chat-widget")
  │     ├── Floating bubble trigger
  │     ├── Chat panel (messages, chips, input, typing indicator)
  │     └── Footer (WhatsApp CTA, Book Consultation CTA)
  └── Header.astro (transition:persist)
        ├── #ai-counselor-btn (desktop)
        └── #ai-counselor-btn-mobile
              └── dispatches CustomEvent('chat:open') on window

Netlify Function: /.netlify/functions/chat
  ├── CORS validation (Origin allowlist)
  ├── Rate limiting (config.rateLimit export)
  ├── System prompt (built from destinations.ts + services.ts)
  ├── History cap (last 40 messages)
  └── @google/genai → gemini-2.5-flash → response text
```

## Implementation Units

### Unit 1 — Netlify Function: `netlify/functions/chat.mts`

- [ ] Install `@google/genai` as a **production** dependency (`yarn add @google/genai`) — must go into `dependencies`, not `devDependencies`, so Netlify's esbuild bundler can resolve it during function build
- [ ] Create `netlify/functions/` directory
- [ ] Add `"dev:netlify": "netlify dev"` script to `package.json` — full-stack local dev requires `netlify dev` (not `astro dev`) so the function is proxied; `yarn dev` alone will 404 on `/netlify/functions/chat`
- [ ] Create `netlify/functions/chat.mts` with:
  - `export const config` block: `path: "/.netlify/functions/chat"`, `rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] }`
  - `export default async (req: Request): Promise<Response>` — modern Netlify handler signature
  - CORS allowlist at module init: `const ALLOWED_ORIGINS = new Set(["https://ranomoedu.com", "http://localhost:4321"]); if (process.env.DEPLOY_URL) ALLOWED_ORIGINS.add(process.env.DEPLOY_URL);`
  - CORS per request: read `Origin` header, check against `ALLOWED_ORIGINS`, reflect conditionally; add `Vary: Origin`; handle `OPTIONS` preflight by returning 204 with CORS headers only; for non-allowlisted origins, respond normally but omit the `Access-Control-Allow-Origin` header
  - Parse JSON body: `{ messages: Array<{role: "user"|"assistant", content: string}> }`. Validate: `messages` is a non-empty array; each item has `role` strictly `"user"` or `"assistant"` — reject with HTTP 400 on any other role value; each `content` is a string with `content.trim().length > 0`
  - Trim history: keep last 40 messages (`messages.slice(-40)`) before forwarding
  - Build system prompt (see below)
  - Call Gemini: `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }).models.generateContent({ model: "gemini-2.5-flash", contents: [...], config: { systemInstruction } })`
  - Map `messages` to Gemini `contents` format: `{ role: "user"|"model", parts: [{ text: content }] }` — note Gemini uses `"model"` not `"assistant"`
  - Import: `import { GoogleGenAI, ApiError } from '@google/genai';`
  - Return `{ reply: response.text ?? '' }` as JSON with appropriate CORS headers; if the resolved text is empty after the nullish coalesce, treat it the same as an error and return the friendly fallback response
  - Error handling: catch `ApiError` (named export from `@google/genai`); use `.status` property to detect 429 → return HTTP 429 with friendly message; on other errors return HTTP 500 with friendly message
- [ ] Create `.env.example` (or update if exists) with `GEMINI_API_KEY=your_key_here`

**System prompt content (build at module init):**
- RanamoBot identity: Ranamo Edu's AI study-abroad counselor
- 7 destination countries from `destinations.ts`: name, tuition range, living cost, entry requirements, intake months, top universities
- 6 services from `services.ts`: title (`service.title`) and short description (`service.shortDesc`) — these are the actual interface field names; `service.name` and `service.description` do not exist
- General topics: IELTS/TOEFL/PTE/GRE/GMAT, SOP/LOR writing, financial docs, PR pathways
- Contact: WhatsApp `+91 73890 27489`, contact page `/contact`
- Guardrails: never fabricate admission statistics, visa approval rates, or fees beyond ranges in the data; for personal profile questions, encourage a free consultation
- Tone: friendly, concise, helpful; avoid markdown in responses (plain text only, as it renders in a chat UI)

**Test scenarios (Unit 1):**
- `OPTIONS` request → 204 with CORS headers, no body
- Request from `http://localhost:4321` → `Access-Control-Allow-Origin: http://localhost:4321`
- Request from `https://ranomoedu.com` → `Access-Control-Allow-Origin: https://ranomoedu.com`
- Request from `https://evil.com` → no `Access-Control-Allow-Origin` header returned
- Request from `https://deploy-preview-42--ranomoedu.netlify.app` with `DEPLOY_URL` set to same → header reflected correctly
- Missing `GEMINI_API_KEY` env var → function returns 500 (caught by error handler)
- `messages` is not an array → function returns 400
- `messages` is an empty array → function returns 400
- 41-message history forwarded → trimmed to 40 before Gemini call
- Gemini 429 → function returns HTTP 429 with friendly JSON `{ error: "..." }`
- Gemini 500 → function returns HTTP 500 with friendly JSON `{ error: "..." }`
- Valid request → returns `{ reply: "<string>" }` with 200

**Files:**
- `netlify/functions/chat.mts` (new)
- `package.json` (add `@google/genai` dependency)
- `.env.example` (new or updated)

---

### Unit 2 — RanamoBot Widget: `src/components/RanamoBot.astro`

- [ ] Create `src/components/RanamoBot.astro`
- [ ] Root element: `<div transition:persist="chat-widget" ...>` — `position: fixed`, `bottom-6 right-6`, `z-[60]`, `flex flex-col items-end gap-3`
- [ ] **Floating bubble** (always visible):
  - `<button id="ranamo-bubble">` — 56×56px, rounded-full, background `--color-primary`, white text, sparkle SVG icon (`aria-hidden="true"`)
  - `aria-label="Open RanamoBot"`, `aria-expanded` toggled by JS
  - `title="Chat with RanamoBot"`
- [ ] **Chat panel** (conditionally shown, `hidden` class toggled):
  - Width: `w-[380px] max-w-[calc(100vw-2rem)]` (full-width with margin on mobile)
  - Height: `max-h-[calc(100dvh-7rem)]` — accounts for mobile browser chrome and on-screen keyboard
  - `rounded-2xl shadow-2xl bg-white border border-(--color-border)` — `flex flex-col overflow-hidden`
  - **Panel header**: bot avatar (sparkle SVG, `--color-accent`), "RanamoBot" bold text, green online dot (`bg-green-400`), close button (`id="ranamo-close"`)
  - **Message area**: `id="ranamo-messages"` — `flex-1 overflow-y-auto p-4 flex flex-col gap-3`
    - User messages: `self-end bg-(--color-primary) text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-sm`
    - Bot messages: wrapper `flex items-start gap-2`; avatar (small sparkle, 24px); bubble `bg-gray-100 text-(--color-text) rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-sm`
    - Typing indicator: `id="ranamo-typing"` — `hidden` by default; same bot bubble wrapper with three animated dots (`animate-bounce` with staggered `animation-delay`)
  - **Quick-reply chips** (shown only before first message): `id="ranamo-chips"` — horizontal scroll, gap-2, `flex flex-wrap px-4 pb-2`
    - Four chips: "What countries do you cover?", "How does Ranamo's process work?", "How much does studying abroad cost?", "Scholarship & visa help"
    - Chip style: `border border-(--color-primary) text-(--color-primary) text-xs px-3 py-1.5 rounded-full hover:bg-blue-50 cursor-pointer transition-colors`
  - **Input row**: `border-t border-(--color-border) p-3 flex gap-2`
    - `<textarea id="ranamo-input">` — `resize-none rows="1"`, `text-sm`, placeholder "Ask me anything…", `max-h-24 overflow-y-auto`
    - Send button `id="ranamo-send"` — 36×36px, `--color-primary` bg, white paper-plane SVG icon (`aria-hidden="true"`), `<span class="sr-only">Send message</span>`; `disabled:opacity-40 disabled:cursor-not-allowed`
  - **Footer CTAs**: `border-t border-(--color-border) px-3 py-2 flex gap-2 shrink-0` — always visible (outside scroll area)
    - "Chat on WhatsApp": `href="https://wa.me/917389027489?text=Hello%21+I%27m+interested+in+studying+abroad.+Could+you+help+me%3F"` `target="_blank" rel="noopener noreferrer"` — same prefill text as existing `WhatsAppButton.astro`; must open in new tab so the chat session is not lost; add `<span class="sr-only">(opens in new tab)</span>` for screen readers; `bg-[#25d366] text-white`, WhatsApp SVG (`aria-hidden="true"`), `text-xs font-semibold px-3 py-2 rounded-lg flex-1 flex items-center justify-center gap-1.5`
    - "Book Consultation": `href="/contact"`, `border border-(--color-primary) text-(--color-primary)`, same sizing
- [ ] **Script** (one `<script>` block, named init function + `astro:page-load` re-registration):
  - Module-level state: `let messages: Array<{role, content}> = []`, `let isOpen = false`, `let hasMessagedOnce = false`, `let welcomeSent = false`
  - `function initRanamoBot()`: query all elements, attach listeners, expose `window.__chatWidget = { open, close }`
  - `open()`: show panel, set `aria-expanded="true"` on bubble, scroll messages to bottom; if `!welcomeSent`, append welcome message: `"Hi! I'm RanamoBot 👋 Ask me anything about studying abroad or how Ranamo Edu can help you."` + show chips, set `welcomeSent = true`
  - `close()`: hide panel, set `aria-expanded="false"`
  - `window.addEventListener('chat:open', open)` — persists across navigations because element is never removed
  - Chip click → `sendMessage(chip.textContent)`, hide chips container (`hasMessagedOnce = true`)
  - Input `keydown` → `Enter` (no shift) submits; `input` event → auto-resize textarea, toggle send button `disabled`
  - Send button click → `sendMessage(input.value.trim())`
  - `async function sendMessage(text)`: guard empty; append user message; clear input; show typing indicator; call `/.netlify/functions/chat` with `{ messages: [...messages] }` (history already includes new user turn); hide typing; append bot reply; scroll to bottom; on error append fallback message
  - Fallback message: `"I'm having trouble connecting right now. Please reach us on WhatsApp or book a consultation using the buttons below."`
  - `document.addEventListener('astro:page-load', initRanamoBot)` — for re-init on navigation (though element persists, listeners on `window` are added once; this covers edge cases)
  - Call `initRanamoBot()` immediately for first load

**Test scenarios (Unit 2):**
- First open → welcome message + 4 chips appear; bubble `aria-expanded="true"`
- Close button → panel hidden; bubble `aria-expanded="false"`
- Chip click → chip text appears as user message, chips container hidden, bot response fetched
- Second open → chips still hidden (already messaged); existing messages still visible
- Empty input → send button disabled, Enter does nothing
- Input with whitespace only → trimmed, treated as empty
- Shift+Enter → newline in textarea, does not submit
- Typing indicator shown while awaiting response, hidden after reply
- Network error → fallback message appears (no crash)
- Widget survives Astro view transition (messages preserved, open/closed state preserved)
- WhatsApp footer link → opens `https://wa.me/917389027489?...` in new tab
- Book Consultation footer link → navigates to `/contact`
- Mobile: panel height does not exceed viewport; message area scrolls independently of footer

**Files:**
- `src/components/RanamoBot.astro` (new)

---

### Unit 3 — BaseLayout Integration: `src/layouts/BaseLayout.astro`

- [ ] Remove `import WhatsAppButton from '@/components/WhatsAppButton.astro'`
- [ ] Remove `<WhatsAppButton />` element from the template
- [ ] Add `import RanamoBot from '@/components/RanamoBot.astro'`
- [ ] Add `<RanamoBot />` before `</body>` (same position as WhatsApp button was)

**Test scenarios (Unit 3):**
- Build completes without error (no import of removed component)
- WhatsApp floating button no longer appears on any page
- RanamoBot bubble appears on every page

**Files:**
- `src/layouts/BaseLayout.astro` (modify)

---

### Unit 4 — Header Rewiring: `src/components/Header.astro`

- [ ] Remove the `<dialog id="ai-counselor-dialog">` element and all its children
- [ ] Remove only the `#ai-counselor-dialog` and `#ai-counselor-dialog::backdrop` rules from the `<style>` block. **Retain** the `#nav-toggle:checked ~ * .nav-bar-1/2/3` rules — these drive the hamburger-to-X animation and are load-bearing for mobile nav
- [ ] Replace the `<script>` block: remove `initAiCounselorDialog()` and the `astro:before-swap` listener entirely
- [ ] Add a new `<script>` block with a named `initAiCounselorButtons()` function:
  ```
  function initAiCounselorButtons() {
    const dispatch = () => window.dispatchEvent(new CustomEvent('chat:open'));
    document.getElementById('ai-counselor-btn')?.addEventListener('click', dispatch);
    document.getElementById('ai-counselor-btn-mobile')?.addEventListener('click', dispatch);
  }
  initAiCounselorButtons();
  document.addEventListener('astro:page-load', initAiCounselorButtons);
  ```
- [ ] Update `aria-haspopup` on both AI Counselor buttons: change from `"dialog"` to `"false"` (the widget is not a `<dialog>` element)
- [ ] Remove the maintenance `<span>` dot (`aria-label="Under maintenance"`) from both AI Counselor buttons; the dot was a visual maintenance indicator and is no longer appropriate

**Listener deduplication:** `astro:page-load` fires on every navigation; since `transition:persist` keeps the header DOM alive, listeners accumulate if added naively. Use `removeEventListener` before `addEventListener` on each re-init call:
```js
function initAiCounselorButtons() {
  const dispatch = () => window.dispatchEvent(new CustomEvent('chat:open'));
  const btnDesktop = document.getElementById('ai-counselor-btn');
  const btnMobile = document.getElementById('ai-counselor-btn-mobile');
  btnDesktop?.removeEventListener('click', dispatch);
  btnDesktop?.addEventListener('click', dispatch);
  btnMobile?.removeEventListener('click', dispatch);
  btnMobile?.addEventListener('click', dispatch);
}
```
Note: for `removeEventListener` to match, `dispatch` must be a stable reference. Alternatively, guard with a module-level `let listenersAttached = false` flag since the header DOM never changes.

**Test scenarios (Unit 4):**
- "AI Counselor" desktop button click → `CustomEvent('chat:open')` fires → RanamoBot panel opens
- "AI Counselor" mobile nav item click → same behavior
- No `<dialog>` element in DOM on any page
- No maintenance dot visible on either AI Counselor button
- Header renders correctly on desktop and mobile after changes
- After Astro view transition, both buttons still open the widget

**Files:**
- `src/components/Header.astro` (modify)

---

## Dependencies and Sequencing

```
Unit 1 (Netlify Function)
    │
    └── Unit 2 (RanamoBot Widget)  ← calls /.netlify/functions/chat
            │
            ├── Unit 3 (BaseLayout)  ← imports RanamoBot component
            │
            └── Unit 4 (Header)     ← no file dependency, but widget must exist
                                       to receive the chat:open event
```

Unit 1 can be built and tested independently with `curl` before the widget exists. Units 3 and 4 are safe to implement in parallel once Unit 2 is done.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini API cold-start adds > 3s latency | Medium | Medium | Typing indicator masks latency; streaming is deferred (see origin Deferred Questions). If noticeable post-launch, evaluate streaming. |
| `transition:persist` open/closed state mismatch after navigation | Low | Low | `isOpen` is module-level; `open()`/`close()` are idempotent. Widget remains in correct visual state. |
| Duplicate `astro:page-load` listeners on header buttons | Low | Low | Use fresh query or `removeEventListener` pattern. Both are equivalent; implementer chooses. |
| Mobile keyboard clips chat panel footer | Medium | Medium | `max-h-[calc(100dvh-7rem)]` with `dvh` units. Verify on real device during implementation. |
| Netlify free tier function invocation limit (125k/month) | Low | Low | Rate limit (20/min/IP) prevents runaway usage. Monitor in Netlify dashboard post-launch. |
| `GEMINI_API_KEY` not set in Netlify env | Medium | High | Function returns 500 with friendly message. Add to deployment checklist (see Dependencies/Assumptions). |

## Dependencies / Assumptions

- `GEMINI_API_KEY` must be obtained (free at aistudio.google.com) and added as a Netlify environment variable before deployment. Without it the function returns 500.
- Netlify Functions v2 (modern handler signature) is the default for new functions — no plugin required.
- `netlify dev` is available for local development; functions are served at `http://localhost:8888/.netlify/functions/chat`.
- For local dev, the widget calls `/.netlify/functions/chat` which resolves correctly when served by `netlify dev` (which proxies both Astro dev server and functions).
- `src/data/destinations.ts` and `src/data/services.ts` use only plain TypeScript (no Astro-specific imports). Confirmed during research.

## Deployment Checklist

- [ ] `GEMINI_API_KEY` set in Netlify environment variables (Site settings → Environment variables)
- [ ] `netlify build` passes locally
- [ ] Manual smoke test: open widget, ask "What countries do you cover?", receive relevant response within 5s
- [ ] Verify "Chat on WhatsApp" footer link opens correct WhatsApp chat
- [ ] Verify "Book Consultation" footer link navigates to `/contact`
- [ ] Verify header "AI Counselor" button opens widget on desktop and mobile
- [ ] Verify no `<dialog>` maintenance modal appears anywhere
- [ ] Verify floating WhatsApp-only button is gone from all pages
- [ ] Test Astro view transition: navigate between pages, confirm chat state persists

## Deferred

- **Streaming responses** (R15 deferred): if perceived latency is unacceptable post-launch, evaluate Gemini's streaming API. Not in scope for this plan.
- **Max history cap tuning**: 40 messages chosen as conservative cap. May be tuned post-launch based on observed conversation lengths.
- **CRM/lead capture**: WhatsApp and Book Consultation links serve this purpose. No in-widget form capture in this plan.
