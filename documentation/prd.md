# PRD — Petros. (Digital Portfolio)

**Author:** João Pedro Carvalho dos Santos (Petros)
**Version:** 1.0
**Date:** June 2026
**Stack:** TanStack Start + React + Tailwind CSS · Deploy on Vercel

---

## 1. Overview

**Petros.** is the complete redesign of João Pedro Carvalho dos Santos' (a.k.a. Petros) digital portfolio. The project migrates the current application — built with Flask, Jinja2, HTMX, and TailwindCSS as a multi-page application — to a modern SPA using **TanStack Start (full-stack React) + Tailwind CSS**, with a premium editorial visual identity centered around the bamboo-and-panda metaphor.

### Problem statement

The current portfolio fulfills its functional role but presents limitations that no longer reflect the developer's current technical level. The multi-page architecture with server-side templates hinders fluid transitions between sections, the internationalization system is manual (using `data-i18n` attributes with a custom script), there is no configurable theme system, and the project organization (simple tabs with carousel) fails to communicate technical depth or editorial narrative. Additionally, the portfolio lacks real-time information (activity status, clock) and an emotional layer that tells the personal story in an engaging way.

### Main objective

Deliver a portfolio experience that simultaneously functions as a professional technical showcase and an editorial piece with personality — communicating in seconds who Petros is, what he does, how he thinks, and how to contact him. The site must be technically impeccable (Lighthouse 95+ across all metrics), highly configurable (30 theme combinations: 2 modes × 5 schemes × 3 languages), and visually distinct from generic portfolios.

### Value delivered

- High-level professional presentation for recruiters, clients, and partners
- Detailed showcase of the 5 FATEC academic projects (course requirement) with personal contributions, lessons learned, and skills sections
- Showcase of 6 professional projects with the same depth
- Personal narrative that humanizes the technical profile (story, curiosities, hobbies)
- Contact system with functional form and direct channels
- Visitor-customizable experience (mode, color scheme, language)
- Real-time integrations via Lanyard API (Discord/Spotify/VS Code activity status)

### Target audience

- Recruiters and technology companies
- Potential freelance clients
- FATEC professors (academic portfolio evaluation)
- Dev community (networking, reference)

### Academic context

The portfolio also meets the requirements of the FATEC SJC portfolio assignment, which requires: a personal photo, clear separation of FATEC API projects, inclusion of professional and personal projects, personal contributions to each project, and relevant information beyond professional aspects (hobbies, curiosities). Oral presentation of 5–7 minutes.

### Main architectural decisions

- **Framework:** TanStack Start (full-stack React with SSR, server functions, type-safe routing) — chosen over pure Vite for the practical benefits of SSR (better SEO), integrated server functions (solves contact backend and dynamic CV without external serverless), and narrative coherence with a cutting-edge technical profile.
- **Host:** Vercel — free deploy on hobby tier, native TanStack Start support, GitHub integration.
- **Content:** Versioned TypeScript files (`src/data/*.ts`) — Sanity CMS was evaluated and discarded after a trade-off analysis (overhead vs. benefit for a solo dev with low content volume).
- **Contact backend:** Native server function from TanStack Start (no separate external service).

---

## 2. Requirements

### Cross-cutting Systems

#### Theme System

- [ ] **Theme System (Mode × Color Scheme)**

**Description:** Visual personalization system with 3 independent dimensions: mode (dark/light), color scheme (5 options), and language (handled in a separate requirement). Total of 10 visual combinations (2 modes × 5 schemes). Controlled via a configuration popover triggered by the gear button in the Header.

##### Business Rules

- **Available modes:** Dark (default) and Light.
- **Available schemes:** Bambuzal (default), Sakura, Glaciar, Crepúsculo, and Pelagem. Each scheme defines tokens for accent, accent-italic, and panda emoji gradients.
- **Initial detection:** On first visit, mode must respect the OS `prefers-color-scheme` as a hint. Default scheme is Bambuzal. Default language is pt-BR.
- **Persistence:** Configuration saved to `localStorage` under the key `petros-theme` with structure `{ mode, scheme, lang }`. Settings persist on return visits.
- **User override:** The user can always change mode, scheme, and language via the popover, overriding any automatic detection.
- **Independence:** The 3 dimensions are independent — changing the scheme does not affect mode or language.

##### UI/UX Rules

- **Implementation via 3-tier CSS Variables:** mode tokens (bg, text, borders), scheme tokens (accent, accent-italic, panda gradients), and component tokens that consume the above via `var()`.
- **HTML root attributes:** `<html lang="pt-BR" data-mode="dark" data-scheme="bambuzal">`.
- **Transition between states:** 400ms ease on all color tokens when switching mode or scheme.
- **External brand colors (Spotify, VS Code, Steam, Discord) DO NOT change with theme** — they are external brands that retain their original colors in any combination.
- **Technology brand colors (React, Vue, Python, etc.) DO NOT change with theme** — they retain their official colors.

---

#### Internationalization (i18n)

- [ ] **Internationalization — 3 languages**

**Description:** Support for 3 locales with dynamic switching without reload: Portuguese (pt-BR, default), English (en), and Spanish (es).

##### Business Rules

- **Coverage:** All visible content must be translated, including section text, button labels, form placeholders, tooltips, error/success messages, eyebrows, and captions.
- **Dynamic content (projects, trajectory):** Translated in data files with `pt | en | es` keys.
- **Editorial content (bio, closers):** Culturally adapted translation, not literal. E.g., "Bora construir?" is not translated to "Let's build?" — it is adapted to something natural in English.
- **Switching:** Via dropdown in the configuration popover (gear button in Header).
- **Persistence:** Saved in `localStorage` as part of `petros-theme`. Updates the `<html lang>` attribute dynamically.
- **Default language:** pt-BR.
- **Multilingual SEO:** Leverage TanStack Start's SSR to serve pre-rendered HTML per language, with `<link rel="alternate" hreflang>` tags for proper indexing.

##### UI/UX Rules

- **Flags:** Inline SVG (not emoji) — Brazil, USA, and Spain, 20×14px with desaturation (`filter: saturate(0.88)`) and rounded corners (radius 2.5px).
- **Each selector row:** SVG flag + native language name + mono code (PT-BR / EN / ES) + accent check on the active one.

---

#### Lanyard Integration

- [ ] **Lanyard API Integration — Real-time Status**

**Description:** Consumption of the Lanyard API to display Petros' real-time Discord activity status. Displayed in two sections: Header (compact pill) and About me (detailed NOW panel).

##### Business Rules

- **Endpoint:** `https://api.lanyard.rest/v1/users/{discord_id}`.
- **Polling:** Every 30 seconds. Cache response locally.
- **4 possible states with priority:** Coding (high) > Playing > Listening (low) > Offline (fallback).
- **Multiple simultaneous activities:** Apply priority order and display only the highest priority in the Header. In the NOW panel (About me), display all 3 simultaneously.
- **Coding state:** Requires the VS Code Discord Rich Presence extension to be active. Displays the file name being edited.
- **Offline fallback:** If the API fails or status returns `offline`, display "Offline · Xh ago" using the last known cached state or estimated timestamp.

##### UI/UX Rules

- **State colors are fixed (non-thematic):**
  - Coding: `#4A8FE7` (VS Code blue)
  - Playing: `#A855F7` (Steam purple)
  - Listening: `#1ED760` (Spotify green)
  - Offline: `#555`
- **Header:** Compact pill with colored dot + icon + text label.
- **About me (NOW panel):** 3 simultaneous rows, each with brand color, Tabler icon, and detailed content. The LISTENING row includes an animated equalizer (3–4 green bars oscillating).
- **Mobile (Header):** Pill collapses to dot + icon only (no text label).
- **`prefers-reduced-motion`:** Equalizer stops oscillating; bars become static.

---

#### Contact Backend

- [ ] **Contact Backend — Server Function**

**Description:** Native TanStack Start server function to process the contact form and send an email to Petros. No dependency on separate external serverless services.

##### Business Rules

- **Server function:** Defined with `createServerFn` from TanStack Start, exposed as a POST endpoint.
- **Validation:** Zod schema applied both on the client (inline, real-time) and in the server function.
- **Required fields:** Name, email (valid format), and message (1–500 characters).
- **Rate limiting:** Maximum 3 messages per IP in 24 hours. Implementation via memory or KV store (Vercel KV).
- **Spam protection:** Honeypot field (hidden input that must remain empty).
- **Honeypot trigger:** If filled, the server function returns success silently and discards the message.
- **Email service:** Resend (recommended due to Vercel integration) or Nodemailer.
- **Recipient:** joaopcarvalho.cds@gmail.com.
- **Environment variables:** Resend API key, rate limit secret, configured in Vercel.

##### UI/UX Rules

- **Success feedback:** Green toast "message sent".
- **Error feedback:** Red toast with contextual message.
- **Backend offline:** Red toast "try via direct channels".
- **Rate limit exceeded:** Toast "too many messages — try again in a few hours".
- **Loading state:** Spinner + "sending..." text on the button during the request.

---

#### Dynamic CV per Language

- [ ] **Dynamic CV per Language**

**Description:** The `Download CV` CTA in the Hero automatically serves the PDF corresponding to the active language at the moment of click. Can leverage TanStack Start's server function to serve the correct PDF based on the `Accept-Language` header or a query parameter.

##### Business Rules

- **3 static files:** `/public/petros-cv-pt.pdf` (Portuguese), `/public/petros-cv-en.pdf` (English), `/public/petros-cv-es.pdf` (Spanish).
- **Automatic mapping:** The system reads the active language (from the configuration persisted in `localStorage` or the default pt-BR) and binds the CTA to the corresponding PDF.
- **Real-time switching:** If the user switches language via the configuration popover, the CTA link updates immediately — no need to reload or scroll back to the Hero.
- **Download filename:** The link's `download` attribute must reflect the language: `petros-cv-pt.pdf`, `petros-cv-en.pdf`, `petros-cv-es.pdf`.
- **Maintenance:** PDFs are static files updated manually. No dynamic generation.

##### UI/UX Rules

- **No visual language indicator on the button:** The button retains its translated label (`Baixar CV` / `Download CV` / `Descargar CV`) according to i18n. The visitor doesn't need to know that 3 versions exist — the system delivers the correct one automatically.
- **Fallback:** If the active language's PDF does not exist (e.g., Spanish not yet created), serve the Portuguese PDF as fallback and display a discreet tooltip stating "CV currently available only in Portuguese".

---

#### WCAG 2.1 AAA Accessibility

- [ ] **WCAG 2.1 AAA Accessibility**

**Description:** The site must seek conformance with the AAA level of WCAG 2.1 guidelines, ensuring the most accessible experience possible for all visitors.

##### Business Rules

- **Color contrast:**
  - Normal text (below 18px / 14px bold): minimum contrast **7:1** against background.
  - Large text (above 18px / 14px bold): minimum contrast **4.5:1** against background.
  - Interactive elements (buttons, links, inputs): minimum contrast **4.5:1** against neighbors.
  - Applicable to **all 10 combinations** of mode × color scheme (2 modes × 5 schemes). Each scheme must be validated individually.
- **Keyboard navigation:**
  - All interactive elements accessible via Tab in logical order (DOM order).
  - Visible focus with outline `var(--accent)` on all focusable elements — never `outline: none` without a substitute.
  - Modals (project dialog, easter egg, settings popover) capture focus (focus trap) and return focus to the originating element on close.
  - Documented keyboard shortcuts: `⌘+,` / `Ctrl+,` for settings, `ESC` to close modals, `← →` to navigate carousel and projects.
- **Screen readers:**
  - `aria-label` on all icon-only buttons (gear, hamburger, modal X, footer socials, carousel arrows).
  - `aria-expanded` on collapsible elements (trajectory expand, accordion).
  - `aria-current` on the active nav item.
  - `role="dialog"` + `aria-modal="true"` on modals.
  - `role="tablist"` + `role="tab"` + `role="tabpanel"` on Project tabs.
  - Descriptive `alt` on all content images. `alt=""` on decorative images.
  - Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<section>` with `aria-labelledby`, `<footer>`.
  - Live regions (`aria-live="polite"`) for dynamically updating content: BRT clock, Lanyard status, carousel counter, form feedback toasts.
- **User preferences:**
  - `prefers-reduced-motion`: All loop animations pause (panda swing, Spotify equalizer, bullet pulse, scroll cue bounce). Transitions reduced to 100ms. Easter Egg gif pauses on first frame.
  - `prefers-color-scheme`: Respected as initial hint for mode. User can always override.
  - `prefers-contrast`: If `more`, increase border thickness from 0.5px to 1px and intensify visual separation.
- **Touch targets:** Minimum 44×44px on all interactive elements.
- **Document language:** `<html lang>` updates dynamically to reflect the active language.
- **Skip navigation:** Hidden `Skip to main content` link at the top, visible only on keyboard focus, anchoring to `<main>`.

##### UI/UX Rules

- **Validation:** All 10 visual states must be tested with contrast tools (axe DevTools, Lighthouse) and achieve score 100 on Lighthouse Accessibility.
- **Screen reader testing:** Validate with VoiceOver (macOS/iOS) or NVDA (Windows).
- **Focus indicator:** Combine outline with offset (`outline-offset: 2px`).
- **Text as image:** None, except for Easter Egg gif (decorative).

---

### Site Sections

#### Header

- [ ] **Section 01 — Header**

**Description:** Persistent (sticky) navigation bar at the top with brand identity, section navigation, live status via Lanyard, and theme configuration button.

##### Business Rules

- **Brand block:** Panda emoji in circle with thematic gradient (32×32px) + `Petros.` text with accent-colored period. Brand click smooth scrolls to the top (Hero).
- **Navigation:** 5 items — Home, About, Stack, Projects, Trajectory. Scroll-spy via intersection observer updates the active item as the user scrolls.
- **Bamboo stalk indicator:** 3 accent vertical segments below the active item (heights 5/7/4px). Animation `scaleY: 0→1` with 200ms stagger. Pulse on central segment: `opacity: 1↔0.55` 2.4s loop.
- **Transition between items:** Old stalk shrinks, new one grows simultaneously.
- **Live status pill:** Displays status via Lanyard. Click smooth scrolls to About me.
- **Gear button:** 32×32px circle opens popover. Shortcut `⌘+,` / `Ctrl+,`. Closes via ESC, click outside, or new click.
- **Configuration popover:** 280px, anchored below the gear. 3 sections: Mode (2 buttons), Scheme (5 rows with gradient circle + check), Language (3 rows with SVG flag + mono code + check). Footer hint: `⌘+, to open · ESC to close`.

##### UI/UX Rules

- **Scroll behavior:** Transparent at the top; backdrop blur `blur(14px)` + 0.5px border-bottom after ~80px scroll.
- **Scroll-spy debounce:** ~150ms.
- **Gear feedback when open:** Accent ring + vertical line connecting to popover + icon turns accent.
- **Light mode:** Stalk drop-shadow glow disappears — compensated by saturation 1.1x.
- **Mobile responsiveness:** Brand + hamburger button. Hamburger opens lateral drawer with vertical nav. Live status collapses to dot + icon. Stalk becomes vertical indicator in the drawer.
- **Accessibility:** `aria-label` on gear and hamburger. Accent outline on focusables.

---

#### Hero

- [ ] **Section 02 — Hero**

**Description:** First impression, occupying full viewport. Summarizes who, what, where, and personality.

##### Business Rules

- **Top metadata:**
  - Left: Status pill `● FULL STACK · LUMETIS · since 05/2026`.
  - Right: `SÃO JOSÉ DOS CAMPOS · SP — BR` + `HH:MM BRT` clock updating every minute.
- **Main block (2-col grid, 60/40):**
  - Left: Name `Petros.` (104–108px, accent period) + serif italic byline + role pill + description.
  - Right: Photo with accent corner brackets + floating tags (`FATEC · 5º SEM`, `a.k.a. Petros`).
- **CTAs:** `Download CV` (primary, server function serves PDF per language) + `See my panda 🐼` (secondary, opens Easter Egg).
- **Bottom line:** Mono tech list (`TS · PYTHON · REACT · NEXT.JS · FLUTTER · AWS`) + scroll cue with bounce.
- **Clock:** Client-side via `Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })`.

##### UI/UX Rules

- **Min-height:** 90vh.
- **Subtle background grid:** Translucent accent vertical lines (~3% dark, ~2% light).
- **Animations:** Name fade-up + letter-spacing (~600ms). Photo fade-right + scale. Tags with ~400ms delay.
- **Photo hover:** Brackets jump 2px outward.
- **Responsiveness:** Grid becomes 1-col. Name shrinks to 56–64px. CTAs full-width.
- **Photo fallback:** `JP` initials in accent circle.

---

#### Trajectory

- [ ] **Section 03 — Trajectory**

**Description:** Vertical timeline with filters showing professional and academic evolution.

##### Business Rules

- **7 entries (reverse chronological):**
  1. 05/2026 — Present: Lumetis (Professional, CURRENT)
  2. 2025 — 05/2026: Design Líquido (Professional)
  3. 2024 — Present: FATEC SJC 5th sem (Academic, IN PROGRESS)
  4. 2024 — Present: Ancra SEO blog (Professional)
  5. 2023 — 2024: Sertton freelance (Professional)
  6. 2022 — 2023: Academic Extension (Academic)
  7. 2022 — 2023: ETEC SJC (Academic)
- **Filters:** ALL (7), PROFESSIONAL (4), ACADEMIC (3). Dynamic counter.
- **Collapse:** First 3 visible. `+ 4 PREVIOUS ENTRIES` button expands with stagger.
- **Each card:** Eyebrow (year + badge + type), date pill, organization + "i" icon, accent role, description, tech tags.
- **Design Líquido highlight:** Mention of Delégua and connection to StarDust thesis.

##### UI/UX Rules

- **Spine:** 2px gradient `linear-gradient(to bottom, var(--accent) 0%, var(--accent) 60%, transparent)`.
- **Markers:** 12×12px accent bullet.
- **Panda mascot:** Hanging on the spine, swing `rotate: -2.5deg ↔ 2.5deg`, 3.8s. Pausable with `prefers-reduced-motion`.
- **Card hover:** Accent border + translateY(-2px).
- **Entrance:** Fade-left when entering viewport.
- **Mobile:** Spine 10px from edge. Panda 50%. Filters with scroll-x.

---

#### Categorized Stack

- [ ] **Section 04 — Categorized Stack**

**Description:** Grid of 35 technologies in 6 categories.

##### Business Rules

- **6 categories:**
  - Frontend (7): TypeScript, React, Next.js, Astro, Tailwind, Vue, Sass
  - Backend (7): Node.js, Python, FastAPI, Fastify, NestJS, Java Spring, Flask
  - Mobile (3): React Native, Expo, Flutter
  - Databases (7): PostgreSQL, MongoDB, MySQL, Redis, Supabase, Firebase, Turso
  - Cloud / DevOps (6): AWS, Docker, Terraform, Pulumi, GCP, Vercel
  - AI & Automation (5): Agno, Gemini, Google ADK, Qdrant, Inngest
- **Each item:** Colored monogram (official brand color) + name. Hover tooltip + docs link.
- **Footer:** `35 TECHNOLOGIES · 6 DOMAINS` + `↻ UPDATED TODAY`.
- **Extensibility:** Edit data file; grid reconfigures.

##### UI/UX Rules

- **Grid:** 3-col desktop, 1-col mobile. Internal 2–3 col.
- **Monograms:** Brand color (non-thematic). 8% translucent bg + solid text.
- **Cards:** bg `var(--bg-card)`, border `var(--border)`, padding 24px.
- **Entrance:** Fade-up stagger ~80ms.
- **Item hover:** Monogram scale 1→1.05.
- **Truncation:** Ellipsis after 14 chars.

---

#### Services

- [ ] **Section 05 — Services**

**Description:** 6 informational cards for freelance clients.

##### Business Rules

- **6 services:**
  - Full Stack Web (`ti-browser-check`) — React, Next.js, Node.js
  - Mobile Apps (`ti-device-mobile`) — React Native, Flutter, Expo
  - APIs & Integrations (`ti-plug-connected`) — REST, GraphQL, FastAPI, NestJS
  - Cloud & DevOps (`ti-cloud-computing`) — AWS, GCP, Terraform, Docker
  - AI Agents (`ti-robot`) — Gemini, Agno, vector search, Qdrant
  - Technical SEO (`ti-seo`) — Astro, structured data, Core Web Vitals
- **Informational cards:** No click action.

##### UI/UX Rules

- **Icon container:** 48×48px (40×40 mobile), bg `rgba(accent, 0.08)`, radius 10px.
- **Cards:** bg `var(--bg-card)`, border, padding 24px, radius 12px.
- **Hover:** Accent border + translateY(-2px) + icon scale.
- **Light mode:** `box-shadow: 0 1px 3px rgba(0,0,0,0.04)`.
- **Entrance:** Fade-up stagger ~100ms.
- **Responsiveness:** 3-col becomes 1-col.

---

#### Projects

- [ ] **Section 06 — Projects**

**Description:** Main showcase with Academic/Professional tabs and detail dialog.

##### Business Rules

- **Tabs:** Academic (5) and Professional (6). Bamboo stalk on the active. Switch with fade-in.
- **Academic:**
  1. Smart Farming — 1st sem 2024/1 — FATEC SJC
  2. Stocker — 2nd sem 2024/2 — FATEC SJC
  3. Chronos — 3rd sem 2025/1 — Necto Systems
  4. Gaia — 4th sem 2025/2 — Tecsus
  5. Animus — 5th sem 2026/1 — Xertica
- **Professional:**
  1. StarDust — 2022–2024 — ETEC Thesis
  2. Pulo do Gato News — 2024 — SEO Blog
  3. News AI — 2024 — AI Agent
  4. Sertton — 2023–2024 — Mobile e-commerce
  5. Serverless Shipping — 2023 — AWS Lambda
  6. Sertton Industrial — 2023–2024 — Web e-commerce
- **Card:** Static image + `VIEW DETAILS` button + eyebrow + title with accent dot + description + tech tags (max 5 + `+N`) + Code/contextual buttons.
- **Mobile projects:** Phone frame with `MOBILE` label.

**Full-screen dialog:**
- **Sticky header:** Eyebrow + X.
- **Hero:** Carousel with arrows, counter, thumbnails. Keyboard ← →, swipe, 6s auto-loop pausable.
- **7 sections:** About, Features, Technologies (sub-cat), Contributions, Lessons, Hard skills (icon chips), Soft skills (icon chips).
- **Navigation:** ← Previous / Next → between projects of the same tab. Disables at extremes. Counter `04 / 05`.
- **Close:** ESC, backdrop click, X.

##### UI/UX Rules

- **Aspect:** 16:9 (web), 9:16 (mobile phone frame).
- **Card hover:** Image scale 1→1.02.
- **`+N` tag:** Popover with remainders.
- **Backdrop:** `rgba(0,0,0,0.92)` (dark) / `rgba(245,240,232,0.92)` (light) + 8px blur.
- **Opening:** Fade-in + zoom 0.95→1.
- **Responsiveness:** 2-col becomes 1-col. Tabs with scroll-x. Dialog 100vh. Arrows become dots. Swipe down closes. Footer 1 column.
- **Edge cases:** Without site → hide button. 1 image → hide arrows/counter.

---

#### About Me

- [ ] **Section 07 — About Me**

**Description:** Emotional layer. Story, curiosities, and real-time activity.

##### Business Rules

- **Bio (4 paragraphs):** Trajectory from almost-engineering → accounting → Python automating spreadsheets → JS and web → ETEC → FATEC → Lumetis. Italic accent on key moments.
- **Photo caption (serif italic):** Explanation about the panda.
- **4 stats with counter animation:**
  - Duolingo: `2,154 days` (Assumption: confirm exact value)
  - Attendance: `100%` since 1st year HS
  - Lofi: `5+ years` daily routine
  - Software: `3+ years`
- **NOW panel:** 3 rows via Lanyard — Coding, Playing, Listening.
- **Long bio:** Gradient fade + "Continue reading" button if exceeding 5–6 paragraphs.

##### UI/UX Rules

- **Photo:** 3:4 aspect + accent brackets + `JP & 🐼` pill label in corner.
- **Stats:** 40–48px number with accent period. Rolling counter animation.
- **NOW panel:** Inner accent glow (8% dark, 4% light). Pulsating bullet 1.5s loop. Spotify equalizer oscillating desynchronized.
- **Entrance:** Photo fade-right + bio fade-left.
- **Responsiveness:** 2-col becomes 1-col. Photo max 280px. Stats 2-col. Panel stacks vertically.
- **Lanyard fallback:** Rows in "offline" state. No music: last played with timestamp.

---

#### Contact

- [ ] **Section 08 — Contact**

**Description:** Conversion with form + direct channels.

##### Business Rules

- **Headlines:** `Vamos conversar?` (54px, "conversar" serif italic) + closer `Bora construir?` (88px) + `(ou só puxar um papo)`. (Editorial expressions in Portuguese, culturally adapted in i18n for EN/ES.)
- **Status pills:** `● ABERTO · FREELAS · REDE · CAFÉ` (pulsating bullet) + `⏱ RESPONDO EM ~2H · FUSO BRT`.
- **Form (3 fields):**
  - Name: `Como te chamo?` / `seu nome aqui`
  - Email: `Pra onde respondo?` / `você@email.com`
  - Message: `O que tem em mente?` / `projeto, ideia, dúvida, café...`, counter `0 / 500`
  - Button `Enviar →` (`ti-send`)
  - Spam note: *"nada de spam, hein 🐼"*
- **4 Channel cards:**
  - Email · more formal — joaopcarvalho.cds@gmail.com
  - LinkedIn · professional network — in/joaopedro-carvalho
  - GitHub · open source — @JohnPetros
  - Discord · casual chat — @johnpetros
- **Validation:** Email real-time. Counter turns accent above 400, red above 480.

##### UI/UX Rules

- **Form container:** card bg, no border, vertical accent bar on the left.
- **Single-line inputs:** Bottom-border 0.5px. Focus: accent border + glow.
- **Send button:** solid accent bg. Hover: gap increases 10→14px, arrow translateX(3px), bg lightens.
- **Channel cards:** card bg without border, 22px icon. Hover: accent bar + bg shift + accent arrow + translate. Light: subtle shadow.
- **Responsiveness:** 2-col becomes 1-col. `Bora construir?` shrinks to 56–64px.

---

#### Panda Easter Egg

- [ ] **Section 09 — Panda Easter Egg**

**Description:** Modal triggered by `See my panda` in the Hero.

##### Business Rules

- **Trigger:** Click the Hero CTA.
- **Content:** Eyebrow `● PANDA · MODE` + pixel art gif of dancing panda + caption *"he dances when you see him"* + meta `GIF · LOOP · 0:02`.
- **Background:** Editorial dark/light with subtle bamboo hill (accent gradient + SVG silhouette).
- **Close:** ESC, overlay, X.

##### UI/UX Rules

- **Modal:** Max-width 340px (300px mobile). card bg, border, radius 16px, padding 22px.
- **Overlay:** `rgba(10,10,10,0.75)` (dark) / `rgba(245,240,232,0.75)` (light) + 6px blur.
- **Opening:** Fade-in + scale 0.95→1 (~300ms).
- **Gif fallback:** Static SVG + caption.
- **`prefers-reduced-motion`:** Pause gif on first frame or static image.

---

#### Footer (Colophon)

- [ ] **Section 10 — Footer (Colophon)**

**Description:** Editorial closure.

##### Business Rules

- **Brand block:** `🐼 Petros.` (36px with accent period) + `FULL STACK DEVELOPER · SINCE 2022` (gray mono) + `by João Pedro Carvalho dos Santos` (serif italic).
- **4 Socials:** 36×36px squares with Tabler icons, no labels (tooltip on hover). Email, LinkedIn, GitHub, Discord. Open in new tab (`rel="noopener"`).
- **Bottom:** `made with ♥ & 🐼` — ♥ accent, 🐼 with `filter: saturate(0.7)`.

##### UI/UX Rules

- **Squares:** card bg, border, radius 8px. Hover: accent border + bg shift. Light: subtle shadow.
- **Divider:** 0.5px solid, vertical margin 20–24px.
- **Entrance:** Subtle fade-up.
- **Responsiveness:** Brand and socials stack vertically (brand on top, socials centered).

---

## 3. User Flow

### Main Journeys

---

**Journey 1 — New Visitor (first impression)**

Context: Person arriving at the site for the first time, with no prior context.

1. User accesses the URL.
2. System detects `prefers-color-scheme` and applies as initial mode. Bambuzal scheme, pt-BR language.
3. TanStack Start's SSR serves pre-rendered HTML already in the correct language.
4. Hero loads with animations: name fade-up, photo fade-right, tags with delay.
5. Transparent Header. BRT clock starts updating.
6. Lanyard is queried and status appears in the pill.
7. User reads name, role, description.
8. Sees the scroll cue and starts scrolling.
9. Header gains backdrop blur + border after ~80px.
10. Scroll-spy activates the bamboo stalk on the corresponding item.
11. User traverses sections: Hero → Trajectory → Stack → Services → Projects → About me → Contact → Footer.
12. Upon reaching Contact, decides between form or direct channel.

---

**Journey 2 — Recruiter (quick technical assessment)**

1. User accesses the URL.
2. System loads with defaults or saved config.
3. Reads Hero quickly: name, role (Lumetis), location.
4. Clicks `Download CV`.
   - **Success:** Server function serves the PDF in the active language. Download starts.
5. Clicks "Stack" in nav.
6. Bamboo stalk migrates; smooth scroll to Stack.
7. Views 35 technologies in 6 categories.
8. Clicks "Projects".
9. Academic tab active by default.
10. Views the 5 FATEC projects. Clicks `VIEW DETAILS` on Animus.
11. Dialog opens with fade-in + zoom. Carousel shows first image.
12. Goes through the 7 sections: About, Features, Technologies, Contributions, Lessons, Hard skills, Soft skills.
13. Clicks `Next →` to see Gaia.
14. Closes the dialog (ESC or X).
15. Switches to Professional tab. Stalk migrates horizontally.
16. Evaluates professional projects.
17. Scrolls to Contact and sends message or accesses LinkedIn.

---

**Journey 3 — Potential client (freelance)**

1. User accesses the URL.
2. Reads Hero, notes role pill.
3. Scrolls to Services.
4. Views the 6 cards, identifies what they need (e.g., "AI Agents").
5. Scrolls to Projects, navigates Professional tab.
6. Clicks `VIEW DETAILS` on News AI.
7. Closes the dialog, scrolls to Contact.
8. Reads status `● ABERTO · FREELAS · REDE · CAFÉ` and `RESPONDO EM ~2H`.
9. Fills out form:
   - Name in `Como te chamo?` field
   - Email in `Pra onde respondo?` field (inline validation)
   - Message in `O que tem em mente?` field (counter updates)
10. Clicks `Enviar →`.
11. Button enters loading state.
12. Server function validates (Zod):
    - **Success:** Email sent via Resend. Green toast "message sent".
    - **Validation failure:** Inline error on field. Submission blocked.
    - **Backend offline:** Red toast "try direct channels".
    - **Rate limit:** Toast "too many messages — try in a few hours".

---

**Journey 4 — FATEC Professor (academic evaluation)**

1. User accesses the deploy link.
2. System loads.
3. Sees Hero with personal photo (requirement).
4. Clicks "Projects".
5. Academic tab with 5 API projects (separation requirement).
6. Clicks `VIEW DETAILS` on Smart Farming.
7. Reads "My contributions" (requirement).
8. Navigates via `Next →` through the 5 projects.
9. Switches to Professional (professional projects requirement).
10. Evaluates StarDust (thesis), Sertton (freelance), Pulo do Gato News.
11. Clicks "About".
12. Reads bio + curiosities: panda, Duolingo, attendance, lofi (information beyond professional requirement).
13. Finishes evaluation.

---

### Interaction Flows

---

**Theme Configuration**

1. User clicks the gear (or `⌘+,` / `Ctrl+,`).
2. Popover opens with fade + slide-down. Gear gains accent ring + line + accent icon.
3. Popover displays 3 sections.
4. **Switch mode:** Click `☀ Light`.
   - Updates `data-mode="light"`.
   - Tokens transition in 400ms ease.
   - `localStorage` updates.
5. **Switch scheme:** Click `Sakura`.
   - Updates `data-scheme="sakura"`.
   - Accent, accent-italic, gradients transition.
   - Check migrates.
6. **Switch language:** Click `English`.
   - Updates `<html lang="en">`.
   - All texts update without reload.
   - Check migrates.
7. Closes popover (ESC, click outside, gear).
8. Gear returns to normal state.

---

**View Project Details**

1. User is in Projects with active tab.
2. Click `VIEW DETAILS`.
3. Dialog opens with fade-in + zoom.
4. Sticky header with eyebrow + X.
5. Carousel shows first image with arrows + thumbnails.
6. Carousel navigation:
   - **Right arrow** or **→:** Next.
   - **Left arrow** or **←:** Previous.
   - **Thumbnail click:** Corresponding image.
   - **Mobile swipe:** Left/right.
   - **Auto-loop:** Every ~6s. Pauses on interaction.
7. Counter updates.
8. User scrolls to read 7 sections.
9. **Navigate between projects:**
   - Click `Next: Stocker →`.
   - Content updates with transition.
   - Footer counter updates.
   - Last: `Next →` disabled.
   - First: `← Previous` disabled.
10. **Close:** ESC, X, backdrop click. Focus returns to origin card.

---

**Filter Trajectory**

1. `ALL · 7` filter active. First 3 visible, 4 collapsed.
2. Click `PROFESSIONAL · 4`.
   - Filter gains active state.
   - Academics fade-out + collapse.
   - 4 professionals remain.
   - Expand button updates if needed.
3. Click `ACADEMIC · 3`: professionals fade-out, academics fade-in.
4. Click `ALL · 7`: all reappear with collapse logic.

---

**Expand Trajectory**

1. First 3 visible. `+ 4 PREVIOUS ENTRIES` button below.
2. Click the button.
3. 4 cards appear with fade-down stagger (~80ms).
4. Button disappears.
5. Spine extends.

---

**Panda Easter Egg**

1. Click `See my panda 🐼` in the Hero.
2. Overlay with 6px blur.
3. Modal (340px) opens with fade-in + scale 0.95→1 (~300ms).
4. Eyebrow `● PANDA · MODE`.
5. Pixel art gif of dancing panda in loop with editorial background.
6. Caption and meta displayed.
7. **Close:** ESC, overlay, X.
8. Modal closes. Focus returns to Hero button.

---

**Email Submission (Contact)**

1. User in Contact.
2. Types name in `Como te chamo?` field.
3. Types email in `Pra onde respondo?`.
   - **Inline validation:** Invalid email → error below field.
4. Types message in `O que tem em mente?`.
   - Counter updates: `0 / 500` → `142 / 500`.
   - Above 400: accent. Above 480: red.
   - 500: input stops accepting.
5. Clicks `Enviar →`.
6. System validates (Zod frontend):
   - **Failure:** Field highlighted, submission blocked.
   - **Success:** Request continues.
7. Button in loading: "sending..." + spinner.
8. Server function receives `{ name, email, message }`.
9. Server function validates:
   - **Honeypot filled:** Returns 200 silently, discards.
   - **Rate limit:** Returns 429. Toast "too many messages".
   - **Zod backend failure:** Returns 400. Generic toast.
   - **Resend failure:** Returns 500. Toast "try direct channels".
   - **Success:** Email via Resend. Returns 200. Green toast. Form clears.

---

**Access Direct Channel (Contact)**

1. User in Contact, cards area.
2. Hover on LinkedIn card.
   - Accent bar on the left fades in.
   - Bg shifts.
   - `↗` arrow turns accent + translate.
3. Click on card.
4. LinkedIn opens in new tab.

---

**Navigation via Header**

1. User at any point.
2. Click "Projects" in nav.
3. Previous stalk shrinks (reverse stagger).
4. New stalk grows below "Projects" (200ms stagger).
5. Smooth scroll to Projects.
6. Scroll-spy confirms "Projects" as active.
7. **Brand click:** Smooth scroll to the top. Stalk migrates to "Home".
8. **Live status pill click:** Smooth scroll to About me. Stalk migrates to "About".

---

**Mobile Navigation (Drawer)**

1. Mobile. Click hamburger.
2. Drawer opens with slide-in.
3. Vertical stack nav with stalk as vertical indicator.
4. Click "About".
5. Drawer closes.
6. Smooth scroll to About me.
7. Stalk in Header (dot + icon mobile) reflects active.

---

## 4. Out of Scope

The items below will **NOT** be developed in this version to keep scope controlled.

### Current site features that won't migrate

- **Multi-page architecture with Flask routes:** Current site has separate routes. Redesign is SPA with continuous scroll + dialog for details.
- **Dedicated StarDust page** (`/projects/stardust`): StarDust is a project like any other, detailed via dialog.
- **Full-screen panda intro animation:** Current site shows an animated panda blocking content. In the redesign, content loads directly and the panda lives in the Easter Egg modal.
- **Email sending via direct Flask SMTP:** Replaced by TanStack Start server function + Resend.
- **"Personal" tab on the projects page:** Removed. Older minor personal projects (BMI Calculator, QR Code Generator, etc.) don't reflect current technical level.

### Optional items from documentation

- **Internal easter egg of sleeping panda** (3x click → sleeping gif): Unnecessary complexity.
- **Invisible reCAPTCHA:** Honeypot + rate limiting already provide sufficient protection.
- **Technology version in Stack tooltips:** Manual maintenance generates debt. Name + link only.
- **Spotify embeds (iframes) in About me:** Replaced by Lanyard integration.
- **`featured` flag on Service cards:** All have equal weight.
- **Click on Service cards scrolling to Contact:** Informational cards. CTA already accessible.

### Features not planned for this version

- **Sanity CMS:** Evaluated and discarded. For a solo portfolio with low volume (~60 documents), versioned TypeScript files offer better DX and zero infra overhead.
- **Admin panel:** Content managed via `src/data/*.ts`. Changes via commit + deploy.
- **Functional MCP server:** No implementation in this version. If prioritized in the future, the MCP server will read directly from TypeScript files or GitHub raw URLs.
- **Integrated blog:** Petros maintains Pulo do Gato News as a separate project.
- **Analytics dashboard or advanced tracking:** No GA, Plausible, etc. Can be added later.
- **PWA / offline support:** No service worker, manifest, or offline cache.
- **Automatic dark mode by time of day:** Only `prefers-color-scheme` + manual toggle.
- **Search or filter within Project tabs:** Volume navigable without search. Filters only in Trajectory.
- **Testimonials section:** No testimonials.
- **Automatic stats update via API:** Duolingo streak, attendance, etc. are static values.
- **Automated testing (E2E, unit):** Personal portfolio doesn't justify investment now.
- **Custom CI/CD pipeline:** Automatic deploy via Vercel on push to main. No custom stages.
- **Real-time preview (if CMS is adopted later):** No visual editing integration.

---

## Appendix

### Defined Stack

- **Framework:** TanStack Start (full-stack React, SSR, server functions, type-safe routing)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Host:** Vercel
- **i18n:** i18next or react-intl (TBD during implementation)
- **Email:** Resend via server function
- **Real-time status:** Lanyard API
- **Data:** TypeScript files in `src/data/`
- **Icons:** Tabler Icons
- **Validation:** Zod (client + server)

### Requirements Summary

**16 requirements total:**

**Cross-cutting systems (6):**
1. Theme System (Mode × Scheme)
2. Internationalization (3 languages)
3. Lanyard Integration
4. Contact Backend (Server Function)
5. Dynamic CV per Language
6. WCAG 2.1 AAA Accessibility

**Site sections (10):**
7. Header
8. Hero
9. Trajectory
10. Categorized Stack
11. Services
12. Projects
13. About Me
14. Contact
15. Panda Easter Egg
16. Footer (Colophon)

### Success Metrics

- Lighthouse 95+ on Performance
- Lighthouse 100 on Accessibility
- Lighthouse 100 on Best Practices
- Lighthouse 100 on SEO
- WCAG 2.1 AAA contrast in all 10 theme combinations
- Contact form response time < 2s
- Automated deploy to production via Vercel

---

**End of PRD.**