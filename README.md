# Ashirwad Digitals — Frontend

Premium Hindu devotional print store. The storefront is designed as a **modern temple of art** — restrained divine luxury: warm ivory surfaces, charcoal ink, soft antique gold, generous whitespace and slow, gentle motion.

## Tech Stack

- **React 19 + TypeScript** on **Vite 6**
- **Tailwind CSS v4** (CSS-first config — all design tokens live in `src/styles/index.css` under `@theme`)
- **Redux Toolkit + RTK Query** (API cache) · **react-router 7**
- **Framer Motion** (state/gesture micro-interactions) · **GSAP + ScrollTrigger** (scroll-driven storytelling)
- **react-hook-form + zod** (forms) · **sonner** (toasts) · **lucide-react** (icons)

## Setup

```bash
cd frontend
cp .env.example .env      # fill VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID
npm install               # installs gsap + refreshes platform binaries
npm run dev               # http://localhost:5173
npm run build             # production build → dist/
npm run typecheck         # tsc --noEmit
```

> **Note on `gsap`:** the redesign was authored in an offline sandbox that could not reach the npm registry, so `node_modules/gsap` currently holds a clearly-labelled **no-op placeholder** (the site renders fully static without it). `gsap@^3.13` is declared in `package.json` — the first `npm install` with network access replaces the placeholder with the real library and all scroll effects come alive. All GSAP usage is progressive enhancement: nothing breaks or hides content if the tween never runs.

## Folder Structure

```
src/
├── styles/index.css        # DESIGN TOKENS (@theme) + base styles — single source of truth
├── lib/
│   ├── motion.ts           # Framer Motion variants, easing, durations (house motion language)
│   └── scrollfx.ts         # GSAP hooks: useHeroIntro, useParallax, useSectionReveal
├── components/
│   ├── ui/                 # Framework primitives (Button, Input, Modal, ImageGallery…) — shared with admin
│   └── shop/               # Storefront design system (ProductCard, Filters, MiniCart, Accordion…)
├── layouts/                # CustomerLayout (header/mega-menu/footer/mini-cart), AdminLayout
├── pages/customer|admin|errors
├── services/               # RTK Query endpoints — DO NOT fetch directly in components
├── store/slices/           # auth, cart, ui (incl. mini-cart drawer state)
├── utils/                  # cn, constants (DEITIES, categories), deity inference, validators
└── routes/index.tsx
public/logo.svg             # brand mark (temple arch + diya) — also favicon.svg
```

## Design Tokens (`src/styles/index.css`)

| Token group | Values |
|---|---|
| `--color-surface-*` | Warm whites & stone — `#FAF7F2` base, `#FFFDF9` cards (`--color-cream`) |
| `--color-primary-*` | Charcoal ink — `#2C2C2C` / `#1A1A1A` (buttons, headings) |
| `--color-accent-*` | Soft antique gold — `#C9A96E` / `#B8944A` (dividers, highlights, CTAs) |
| Radius | 4 / 8 / 12 px + pill (`--radius-sm/md/lg/full`) |
| Shadows | `--shadow-soft/card/elevated/glow` — warm-tinted, low opacity |
| Type scale | 10px (`--text-2xs`) → 72px (`--text-display`) |
| Motion | `--duration-fast/normal/slow` (200/400/700ms), `--ease-luxe` |

Token *names* (`primary`, `accent`, `surface`) were kept from the previous system so the admin area inherits the theme without code changes. **No hardcoded colors/durations in components** — everything consumes tokens via Tailwind utilities or CSS vars. Spacing uses Tailwind's default 4px base scale.

Helper classes: `.eyebrow` (gold small-caps label), `.hairline-gold`, `.veil-divine` (hero image overlay), `.glass`, `.focus-ring` (soft-gold focus outline).

## Typography

- **Headings — Cormorant Garamond**: refined, slightly wide serif with temple/heritage warmth (closest Google-Fonts voice to the wide, high-contrast brand letterforms).
- **Body/UI — Inter**: crisp readability at small sizes; body line-height 1.5.
- **Accent/price/buttons — Montserrat** with `tracking-luxe` (0.18em) uppercase — the "wide minimalist" luxury tone.

Loaded via Google Fonts in `index.html`; exposed as `font-display`, `font-sans`, `font-accent`.

## Animation Conventions

- **Durations 400–700ms**, easing `cubic-bezier(0.25, 0.1, 0.25, 1)` everywhere. No bounce, no springs.
- **Framer Motion** for state/gesture: hovers, drawers (mini-cart, filters, mobile nav), page transitions, staggered grid reveals (`components/shop/Reveal.tsx`, `lib/motion.ts`).
- **GSAP + ScrollTrigger** only for scroll-position work: homepage hero intro timeline, parallax, section reveals (`lib/scrollfx.ts`).
- **One engine per element** — a GSAP-driven element is never also animated by Framer.
- **`prefers-reduced-motion` is always respected**: a global CSS kill-switch plus `useReducedMotion` guards in every animated component; GSAP hooks bail out entirely.

## Accessibility & Performance

Semantic landmarks, keyboard-navigable mega-menu/drawers with focus management, `aria-expanded/pressed/current` states, soft-gold `:focus-visible` outlines, descriptive deity `alt` text, `loading="lazy"` + `decoding="async"` images, route-level code-splitting (`React.lazy`), memoized filtering. Breakpoints: mobile-first 375 / 768 / 1280.

See `DEPLOYMENT.md` for hosting instructions.
