# Rayyan Mohammed — Portfolio Plan

Build a designer-grade, dark cinematic red portfolio that mirrors reference photo 1 exactly — same sections, layout, typography, splash textures, dotted skill meters, glowing solar-system skills diagram, anime-room about scene, and timeline.

## Pages / Routes

You said "3 pages." The reference is one long scroll with 7 sections (Home, About, Skills, Projects, Achievements/Hobbies, Contact). I'll split into 3 routes so each is shareable and SEO-friendly, while keeping the visual language identical:

1. `/` — **Home** (Hero + About + Skills, the visually-richest part of the mock)
2. `/projects` — **Projects + Achievements/Journey timeline**
3. `/contact` — **Hobbies + Contact card**

Shared dark sidebar nav (icons) + top nav (HOME · ABOUT · SKILLS · PROJECTS · ACHIEVEMENTS · HOBBIES · CONTACT) on every page, with anchor scroll on `/` and route links for the others.

## Visual System (locked to the mock)

- **Palette:** near-black background `#0a0405`, panel `#140709`, signature red `#e10a17`, red glow `#ff2a2a`, off-white `#f5f1ea`, muted gray `#8a8a8a`. Red paint-splash and scratch textures behind hero + section dividers.
- **Typography:**
  - Display (name, section headlines): **Anton** — heavy condensed sans, exactly the chiseled look in the mock. "RAYYAN" rendered in cracked silver-white, "MOHAMMED" in cracked red with subtle grain overlay.
  - UI / body: **Inter** (tight tracking).
  - Mono accents (tags like "HI, I'M", "AI Engineer | Developer | …"): **JetBrains Mono**.
  Loaded via `<link>` in `__root.tsx` head, registered as `--font-display`, `--font-sans`, `--font-mono` tokens in `src/styles.css`.
- **Textures:** generated red paint-splash PNG behind hero, faint dot-grid + scratch lines as section backgrounds, radial red glow under the headline.
- **Components match mock 1:1:** left icon rail, top nav with red underline on active, hero with portrait + "Watch My Intro" round play button, two CTA rows (Explore / Download Resume / GitHub / LinkedIn), about scene with floating "+" hotspot pins (Dream Big, Deku Figure, Laptop, Coffee Mug, Luffy Poster, Bleach Manga, Emoji Lamp), solar-system skills diagram (central "AI ENGINEERING" core, 6 orbiting nodes: Languages, AI & ML, Backend, Databases, Frontend, DevOps & Tools) with orbital ellipses + drifting particles, dotted 7-pip skill meters panel, horizontal project card rail with chevron paginator, vertical year-dot journey timeline, hobby cards carousel with pagination dots, "Let's Build Something Great" contact card with giant graffiti "RM" mark.

## Assets (generated, saved under `src/assets/`)

- `hero-portrait.png` — uses uploaded photo 2 (red-background headphones shot) directly via Lovable Assets pointer.
- `about-scene.png` — uses uploaded photo 3 (anime room illustration) via Lovable Assets pointer.
- `splash-red.png`, `scratch-overlay.png`, `dot-grid.svg` — generated textures.
- Project thumbnails — generated stylized previews per project (HelioX graph, Multi-Agent tree, MCP terminal, BadgeVerse chat, PDF Analyzer).
- Hobby tiles — Anime (Luffy), Badminton, Chess, Coffee (generated).
- Resume PDF available at `/resume.pdf` via the uploaded file.

## Content (from your resume)

- Name, tagline tokens (AI Engineer · Developer · Problem Solver · Builder), bio from SUMMARY.
- 5 projects: HelioX, Multi-Agent System, MCP Chat, BadgeVerse, PDF Analyzer — each with stack tags from resume.
- Popular skills meter (7 dots filled per level): Python 7, LangChain 7, LangGraph 6, RAG 7, FastAPI 6, React 6, MongoDB 6, Docker 5.
- Timeline: 2025 SIH, 2025 Quantum Valley Hackathon, 2024 100+ LeetCode, 2023-Now 5+ Projects.
- Contact: email, LinkedIn, GitHub, Visakhapatnam.

## Technical Notes

- TanStack Start file routes: `src/routes/index.tsx`, `projects.tsx`, `contact.tsx`; shared `<SiteShell>` component with sidebar + topnav.
- Tailwind v4 theme tokens in `src/styles.css` (oklch). All colors via semantic tokens — no hardcoded hex in JSX.
- Solar-system skills built with absolute-positioned divs + SVG ellipses + CSS `@keyframes` slow rotation; orbit dust particles via small animated divs (no extra libs).
- Cracked-text effect: layered text with SVG turbulence filter + grain PNG mask.
- Framer-motion already permitted — used sparingly for hero fade-in and play-button pulse only.
- Per-route `head()` with unique title/description/OG.
- No backend needed; "Download Resume" links to `/resume.pdf` (copied from upload to `public/`).

## Out of scope (ask if you want them)

- Real HeyGen avatar video — the "Watch My Intro" button will be a styled placeholder.
- Light-mode toggle (icon shown but cosmetic; mock is dark-only).

Ready to build on approval.