---
name: content-update
description: Update site content by editing the SQLite database and rebuilding. Use when the user wants to change text, prices, availability, images, palettes, FAQ items, or any content that lives in the DB. This is the most common task for this project.
---

# Content Update

## Overview

HiHive is a static site where all content lives in `db/hihive.db`. Content changes are DB edits + a rebuild — no code changes needed. This skill covers the safe workflow for updating content without breaking the build.

## When to Use

- User wants to change any text on the site (hero title, descriptions, contact info, etc.)
- User wants to update prices, desk/office availability
- User wants to swap images
- User wants to change the color palette
- User wants to add/remove FAQ items
- User wants to add/remove desks or offices

## Workflow

### Step 1: Identify what table(s) to edit

| Content | Table | Column(s) |
|---|---|---|
| Hero text/title/subtitle | `site` | `hero_eyebrow`, `hero_title`, `hero_sub`, `hero_title_color`, `hero_title_font_size`, `hero_title_italic` |
| Hero metrics (350m², 24/7, etc.) | `site` | `hero_meta_json` (JSON array) |
| Hero photo | `site` | `hero_photo` (path like `/img/hero.png`) |
| Palette | `site` | `palette` (`terracotta` \| `sage` \| `midnight` \| `paper`) |
| Contact info | `site` | `phone_display`, `phone_intl`, `email`, `address_line1`, `address_line2`, `address_short`, `address_city`, `hours`, `map_query` |
| Reserva intro | `site` | `reserva_intro`, `wa_message` |
| Footer | `site` | `footer_tag`, `footer_year`, `footer_version`, `brand_name`, `brand_em` |
| Space cards | `spaces` | `name`, `desc`, `price`, `unit`, `photo`, `label`, `featured`, `cta_label`, `benefits` (JSON array) |
| Desk availability | `desks` | `taken` (0/1), `free_date` (ISO date or NULL) |
| Office availability | `offices` | `taken`, `price`, `free_date` |
| Office photos | `office_photos` | `title`, `src`, `sort_order` |
| Gallery | `gallery_categories` + `gallery_photos` | categories and their photos |
| FAQ | `faq` | `question`, `answer`, `sort_order` |

### Step 2: Apply the change

Use `bun` to run SQL against the DB. Example:

```sh
# Change palette
bun -e "const {Database} = require('bun:sqlite'); const db = new Database('db/hihive.db'); db.run('UPDATE site SET palette = ? WHERE id = 1', ['sage']); db.close();"

# Mark desk 3 as taken, free Aug 1
bun -e "const {Database} = require('bun:sqlite'); const db = new Database('db/hihive.db'); db.run('UPDATE desks SET taken = 1, free_date = ? WHERE id = 3', ['2026-08-01']); db.close();"
```

For complex edits (multiple rows, new tables), write a temporary script or use the user's DataGrip/DBeaver.

### Step 3: If images changed, upload them

Images go in `static/img/`. The path in the DB must match exactly:
- `/img/hero.png` → `static/img/hero.png`
- `/img/spaces/mesas.png` → `static/img/spaces/mesas.png`
- `/img/offices/of1-1.png` → `static/img/offices/of1-1.png`
- `/img/gallery/despacho-1.png` → `static/img/gallery/despacho-1.png`

### Step 4: Rebuild

```sh
bun run build              # → dist/ (production)
bun run build:preview      # → preview/ (staging, doesn't touch dist/)
```

### Step 5: Verify

```sh
# Check build output has content (not empty shell)
wc -c dist/index.html      # should be ~30KB
grep -c '<section' dist/index.html  # should be > 0

# Verify specific content landed in the HTML
grep 'new text here' dist/index.html
```

## Rules

- **Never edit `db/seed.sql` for content updates** — that file is only for initial setup. Edit the `.db` file directly.
- **Image paths must match files** — if you set `hero_photo = '/img/hero.jpg'` in the DB, the file `static/img/hero.jpg` must exist or the build will 404.
- **`hero_meta_json` is a JSON array** — format: `[{"k":"350 m²","l":"label with <br />"},{"k":"24/7","l":"label"}]`. Always valid JSON.
- **`benefits` in `spaces` is a JSON array** — format: `["WiFi fibra","Acceso 24/7"]`. Always valid JSON.
- **`phone_intl` has no `+`** — it's `34640723018` not `+34640723018`. The `+` is added in the component.
- **`free_date` is ISO format** — `2026-08-01`, not `August 1, 2026`.
- **`taken` is 0 or 1** — not boolean true/false.
- **Always rebuild after DB edits** — the static HTML is baked at build time. DB changes don't appear until you run `bun run build`.