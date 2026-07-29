---
name: build-verify
description: Build the HiHive static site and verify the output is correct. Use after any code or content change to confirm the build succeeds and produces proper prerendered HTML (not an empty SPA shell).
---

# Build & Verify

## Overview

HiHive builds to static HTML via SvelteKit's adapter-static. The build must produce fully prerendered HTML — not an empty SPA shell. This skill covers the build commands and the verification checks that catch common failures.

## When to Use

- After any code change (new component, CSS edit, config change)
- After any DB content change
- Before deploying to production
- When diagnosing a build failure

## Build Commands

```sh
bun run build              # → dist/ (production output)
bun run build:preview      # → preview/ (staging, doesn't touch dist/)
BUILD_DIR=/tmp/test bun run build  # custom output dir
```

All use `bun --bun vite build` internally. The `--bun` flag is mandatory — it makes Vite resolve `bun:sqlite`.

## Verification Checklist

### 1. Build succeeds

```sh
bun run build 2>&1 | tail -5
# Must show: "✔ done" and "Wrote site to dist"
# Must NOT show: "error" or "Build failed"
```

### 2. Output size is correct

```sh
wc -c dist/index.html
# Should be ~30KB (32,622 bytes as of last build)
# If ~1.4KB → SPA shell, prerendering failed (check for `fallback` in vite.config.ts)
```

### 3. Content is prerendered (not client-rendered)

```sh
grep -c '<section' dist/index.html
# Should be > 0 (sections are prerendered into HTML)

grep -oE '(HiHive|Trabaja tranquilo|Nuestras mesas|Nuestras oficinas|Contacta con nosotros|Condiciones generales)' dist/index.html | sort -u
# Should return all 6 strings — they're baked into the HTML at build time
```

### 4. Images are present

```sh
find dist/img -type f | wc -l
# Should be > 0 (images copied from static/)

# Check a specific image referenced in the DB exists in dist/
ls dist/img/hero.png
```

### 5. Legal pages exist

```sh
ls dist/aviso-legal.html dist/privacidad.html dist/cookies.html
# All 3 must exist — the footer links to them and prerendering follows links
```

### 6. Type check passes

```sh
bun run check 2>&1 | tail -3
# Should show: "svelte-check found 0 errors and 6 warnings"
# The 6 warnings are a11y on modal overlays (acceptable)
# Any errors must be fixed
```

## Common Build Failures

### "Cannot find module 'bun:sqlite'"
- **Cause**: Build ran without `--bun` flag, or Bun is not the runtime.
- **Fix**: Ensure `package.json` scripts use `bun --bun vite build`. Run `sh setup.sh` to ensure Bun is installed.

### "404 /img/something.png (linked from /)"
- **Cause**: The DB references an image path that doesn't exist in `static/img/`.
- **Fix**: Either upload the image to `static/img/` or update the DB path to match an existing file.

### "404 /aviso-legal (linked from /)"
- **Cause**: A route is linked but doesn't exist. The footer links to `/aviso-legal`, `/privacidad`, `/cookies`.
- **Fix**: Ensure these route directories exist under `src/routes/`.

### Build produces 1.4KB index.html (SPA shell)
- **Cause**: `fallback` option is set in adapter-static config, enabling SPA mode.
- **Fix**: Remove `fallback` from `vite.config.ts` adapter config. We want full prerender, not SPA.

### "unable to open database file"
- **Cause**: `db/hihive.db` doesn't exist, or the path resolution is wrong.
- **Fix**: Run `bun run db:init` to create the DB. Verify `db.ts` uses `process.cwd()` for path resolution.

## Rules

- **Always run `bun run build` (not `vite build`)** — the `--bun` flag is required.
- **Never commit `dist/` or `preview/`** — they are build artifacts.
- **The 6 a11y warnings are expected** — they're on modal overlay `<div onclick>` patterns. Don't "fix" them by breaking the modal UX.
- **`bun run check` may show stale LSP errors** — run `bun run prepare` (svelte-kit sync) first if you see type errors that don't make sense.