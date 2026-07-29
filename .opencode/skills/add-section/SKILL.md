---
name: add-section
description: Add a new section or component to the HiHive landing page. Use when the user wants to add a new visual section, a new component, or extend the page with new functionality beyond simple content edits.
---

# Add Section

## Overview

Adding a new section to HiHive requires coordinated changes across 6 files: the component, the CSS, the DB schema, the data layer, the load function, and the page composition. This skill ensures nothing is missed.

## When to Use

- User wants a new visual section on the page (e.g. testimonials, pricing table, team, blog)
- User wants a new interactive component (e.g. calendar, contact form, newsletter signup)
- User wants to extend an existing section with new data from the DB

**When NOT to use:**
- Changing existing content (use `content-update` skill)
- Changing styles of existing components (just edit `app.css`)

## Workflow

### Step 1: Create the component

Create `src/lib/components/NewSection.svelte` following these rules:
- Svelte 5 runes mode: `$props`, `$state`, `$derived`, `$effect`
- No `<style>` blocks — all CSS is global in `app.css`
- `let { propName } = $props()` for props
- `onclick={fn}` not `on:click={fn}`
- `{@render children()}` for children, not `<slot />`
- `lang="ts"` in script tag

### Step 2: Add CSS classes

Add styles to `src/app.css` following existing conventions:
- BEM-ish naming
- CSS custom properties (`var(--accent)`, `var(--ink)`, etc.) for theming
- Responsive with `@media` queries
- Use `clamp()` for fluid sizing (see existing patterns)

### Step 3: Add data to the DB

Add a new table or extend the `site` table in `db/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS new_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
```

Add seed data to `db/seed.sql`:

```sql
INSERT INTO new_data (title, content, sort_order) VALUES
('Item 1', 'Content 1', 1),
('Item 2', 'Content 2', 2);
```

Recreate the DB: `bun run db:init` (destructive — drops existing data).

### Step 4: Add query to the data layer

Add types and queries to `src/lib/server/db.ts`:

```typescript
export interface NewData {
  id: number;
  title: string;
  content: string;
  sort_order: number;
}

export function getNewData(): NewData[] {
  return db().query('SELECT * FROM new_data ORDER BY sort_order').all() as NewData[];
}
```

Add to the `HomeData` interface and `getHomeData()` function.

### Step 5: Add to the load function

Add the new data to the return of `src/routes/+page.server.ts`:

```typescript
import { getHomeData } from '$lib/server/db';
export async function load() {
  return getHomeData(); // already includes the new field if you added it to HomeData
}
```

### Step 6: Import and render in +page.svelte

Add the component to `src/routes/+page.svelte`:

```svelte
import NewSection from '$lib/components/NewSection.svelte';

// in the template, between existing sections:
<NewSection items={data.newData} />
```

### Step 7: Build and verify

```sh
bun run check     # 0 errors expected
bun run build     # must succeed
grep -c '<section' dist/index.html  # should increase by 1
```

## Rules

- **Never import `bun:sqlite` or `$lib/server/db` from a `.svelte` component.** Components receive data via props from the load function.
- **No `<style>` blocks in components.** All CSS goes in `src/app.css`.
- **Always add to `HomeData` interface** when adding a new query — the load function returns a single typed object.
- **Recreate DB with `bun run db:init`** after schema changes — this is destructive, warn the user.
- **Test the build after every section addition** — `bun run build` must produce prerendered HTML.