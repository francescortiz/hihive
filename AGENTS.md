# AGENTS.md — HiHive Coworking v2

> Static site generator for a coworking landing page. SQLite → SvelteKit prerender → `dist/`.

## What this project is

A single-page marketing site for HiHive Coworking (Barcelona). Content lives in a SQLite database (`db/hihive.db`). At build time, SvelteKit reads the DB via `bun:sqlite` and prerenders everything to static HTML. No server runtime — just static files served by a reverse proxy.

The design prototype (React + Babel, not production) lives in `claude-design/project/`. It is reference-only — do not edit it. All production code is in `hihive-v2/`.

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | SvelteKit 5 (runes mode) | `$state`, `$props`, `$effect`, `$derived` |
| Adapter | `@sveltejs/adapter-static` | Prerenders to static HTML |
| Runtime | Bun 1.2 | `bun:sqlite` built-in, no native deps |
| Database | SQLite | Single file `db/hihive.db`, edited with DataGrip/DBeaver |
| Tool manager | mise | `.mise.toml` pins Bun version |
| CSS | Global `src/app.css` | Extracted from prototype, no component `<style>` blocks |

## Critical rules

### Build command
```sh
bun run build              # → dist/ (production)
bun run build:preview      # → preview/ (staging, doesn't touch dist/)
BUILD_DIR=/path bun run build  # custom output dir
```
The `bun --bun` flag in the build script is **mandatory** — without it Vite can't resolve `bun:sqlite`. Never change `bun run build` to plain `vite build`.

### Server-only modules
`bun:sqlite` is imported only in `src/lib/server/db.ts`. SvelteKit's `.server.ts` convention tree-shakes it from client bundles. **Never import `bun:sqlite` or `$lib/server/db` from a non-`.server.ts` file or a `.svelte` component.** Components receive data via `load` function props (`let { data } = $props()`).

### CSS
All styles are global in `src/app.css`. Components use class names — no `<style>` blocks. If you need a new style, add it to `app.css` following the existing conventions (BEM-ish, CSS custom properties for theming).

### Svelte 5 runes
This project uses runes mode exclusively. Do not use legacy Svelte 4 syntax:
- `let { x } = $props()` — not `export let x`
- `onclick={fn}` — not `on:click={fn}`
- `$state()`, `$derived()`, `$effect()` — not `let x = 0` with reactivity
- `{@render children()}` — not `<slot />`
- `<svelte:element this={tag}>` — not `<svelte:component this={Comp}>`

### Database schema
The schema is in `db/schema.sql`, seed data in `db/seed.sql`. To recreate the DB from scratch: `bun run db:init` (destructive — drops existing data). The DB has 7 tables:
- `site` (1 row) — global config: palettes, hero, contact, phone, address
- `spaces` — the 2 main cards (Mesas, Oficinas)
- `desks` — individual desk availability (id, taken, free_date)
- `offices` — office availability (id, taken, price, free_date)
- `office_photos` — photos per office
- `gallery_categories` + `gallery_photos` — gallery by category
- `faq` — accordion FAQ items

### Palettes
4 palettes defined in `+layout.svelte`: `terracotta`, `sage`, `midnight`, `paper`. The active palette is stored in `site.palette` (DB) and applied via CSS custom properties in a `$effect`. To add a new palette, add it to the `PALETTES` object in `+layout.svelte` and set `site.palette` in the DB.

### Images
Images live in `static/img/` and are referenced by absolute path in the DB (e.g. `/img/hero.png`). SvelteKit copies `static/` to the output root at build time. Image paths in the DB must match files in `static/`. The current images are solid-color PNG placeholders — replace with real photos.

## Project structure

```
hihive-v2/
├ db/
│  ├── schema.sql              # DB schema (7 tables)
│  ├── seed.sql                # Initial data
│  └── hihive.db               # The SQLite DB (gitignored, editable)
├ scripts/
│  └── init-db.ts              # Recreates DB from schema + seed
├ src/
│  ├── app.css                 # Global styles (1023 lines, from prototype)
│  ├── app.html                # Root HTML template (fonts, meta)
│  ├── lib/
│  │  ├── components/          # 22 Svelte 5 components
│  │  │  ├── Nav.svelte        # Sticky header
│  │  │  ├── Hero.svelte       # Hero section
│  │  │  ├── Espacios.svelte   # Spaces section (composes SpaceCard, boards, ZonasComunes)
│  │  │  ├── SpaceCard.svelte  # Individual space card
│  │  │  ├── AvailabilityBoard.svelte  # Desk/office availability grid
│  │  │  ├── UnitPhotos.svelte # Photo modal for a specific office
│  │  │  ├── SpacesGallery.svelte     # Full gallery modal
│  │  │  ├── ZonasComunes.svelte      # Common areas collage
│  │  │  ├── Lightbox.svelte  # Fullscreen photo viewer
│  │  │  ├── Reveal.svelte    # Scroll-reveal wrapper (IntersectionObserver)
│  │  │  ├── Reserva.svelte    # Booking section (WhatsApp/Telegram)
│  │  │  ├── Contacto.svelte   # Contact section (address, map)
│  │  │  ├── Faq.svelte        # FAQ accordion
│  │  │  ├── Footer.svelte     # Footer
│  │  │  └── *Icon.svelte      # 8 SVG icon components
│  │  └── server/
│  │     └── db.ts             # SQLite access layer (server-only)
│  └── routes/
│     ├── +layout.svelte       # Imports CSS, applies palette
│     ├── +layout.server.ts    # Loads site data globally
│     ├── +layout.ts           # Prerender config
│     ├── +page.server.ts      # Loads all home data from DB
│     ├── +page.svelte         # Composes all sections
│     ├── aviso-legal/         # Placeholder legal page
│     ├── privacidad/          # Placeholder legal page
│     └── cookies/            # Placeholder legal page
├ static/
│  ├── favicon.svg
│  └── img/                    # All images (placeholders, replace)
├ vite.config.ts              # adapter-static, BUILD_DIR env var
├ .mise.toml                  # Bun version pin
└ setup.sh                    # Idempotent env setup (mise + bun)
```

## Data flow

```
db/hihive.db
    ↓ (bun:sqlite, build time only)
src/lib/server/db.ts
    ↓ (typed queries)
src/routes/+page.server.ts (load)
    ↓ (serialized into __data.json)
src/routes/+page.svelte
    ↓ (Svelte 5 components render HTML)
dist/index.html (static, 32KB, fully prerendered)
```

## Verification

```sh
bun run check     # svelte-check: 0 errors expected (6 a11y warnings on modals are acceptable)
bun run build     # must succeed and produce dist/index.html with prerendered content
```

Verify build output contains real content (not SPA shell):
```sh
grep -c '<section' dist/index.html   # should be > 0
wc -c dist/index.html                # should be ~30KB, not ~1KB
```

## Common tasks

### Add a new section
1. Create `src/lib/components/NewSection.svelte` (runes mode, no `<style>`)
2. Add CSS classes to `src/app.css`
3. Add data to the DB (new table or extend `site`)
4. Add query to `src/lib/server/db.ts`
5. Add to `+page.server.ts` load return
6. Import and render in `+page.svelte`

### Change content (no code)
1. Edit `db/hihive.db` with DataGrip/DBeaver
2. Upload images to `static/img/`
3. `bun run build`

### Add a new desk/office
1. `INSERT INTO desks (id, taken, free_date) VALUES (6, 0, NULL);`
2. `bun run build`

### Change palette
1. `UPDATE site SET palette = 'sage' WHERE id = 1;`
2. `bun run build`

## Gotchas

- **`bun --bun` flag**: The build script uses `bun --bun vite build`. The `--bun` flag makes Vite use Bun's module resolver, which is required for `bun:sqlite`. Without it, the build fails with "Cannot find module 'bun:sqlite'".
- **DB path at build time**: `db.ts` resolves the DB path via `process.cwd()`, not `__dirname`, because SvelteKit compiles `.server.ts` files to `.svelte-kit/output/server/` during build. Don't change this to `import.meta.url`-based resolution.
- **No `fallback` in adapter-static**: The `fallback` option enables SPA mode (empty HTML shell + client-side rendering). We want full prerendered HTML, so `fallback` must be omitted.
- **Image extensions**: The DB seed uses `.png` paths. If you change image extensions, update both the files in `static/img/` and the paths in `db/seed.sql`, then re-run `bun run db:init`.
- **Legal pages**: `/aviso-legal`, `/privacidad`, `/cookies` are placeholder pages. The footer links to them. If you delete these routes, the build will fail with 404 errors during prerendering.