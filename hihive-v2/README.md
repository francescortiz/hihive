# HiHive Coworking v2 — Web estática personalizable

Landing page del coworking HiHive (Barcelona), generada como sitio estático a partir de una base de datos SQLite. Edita la DB, ejecuta un comando, y `dist/` se actualiza.

## Stack

- **SvelteKit 5** (runes mode) + `@sveltejs/adapter-static` → output HTML estático
- **Bun** + `bun:sqlite` (built-in, sin dependencias nativas) → lectura de DB en build time
- **SQLite** → contenido editable con DataGrip/DBeaver
- **mise** → gestiona la versión de Bun

## Flujo de trabajo

### 1. Editar la base de datos

La DB está en `db/hihive.db`. Ábrela con DataGrip/DBeaver (conectando por SSH tunnel al archivo del server).

Tablas principales:
- `site` — config global (1 fila): paleta, hero, contacto, teléfono, dirección, etc.
- `spaces` — tarjetas de espacios (Mesas, Oficinas)
- `desks` — mesas individuales (estado libre/ocupada + fecha de liberación)
- `offices` — oficinas privadas (estado, precio)
- `office_photos` — fotos por oficina
- `gallery_categories` + `gallery_photos` — galería de espacios
- `faq` — condiciones generales (acordeón)

### 2. Subir imágenes

Sube las imágenes a `static/img/`:
- `static/img/hero.png` — foto del hero
- `static/img/spaces/` — fotos de las tarjetas (mesas, oficinas)
- `static/img/offices/` — fotos por oficina (of1-1.png, of1-2.png, …)
- `static/img/gallery/` — fotos de la galería

Las rutas en la DB deben coincidir (ej: `/img/hero.png`).

### 3. Generar el output

```sh
bun run build              # → dist/ (producción, el que mapea el reverse proxy)
bun run build:preview      # → preview/ (para ver cómo va quedando sin tocar dist/)
BUILD_DIR=/tmp/test bun run build   # cualquier otra ruta
```

Esto lee la DB, prerendera todo el HTML, y escribe al directorio indicado. El reverse proxy mapea `dist/`.

## Setup inicial (en el server o en local)

```sh
sh setup.sh        # instala mise + bun si no están
bun run db:init    # crea la DB desde schema.sql + seed.sql (solo la primera vez)
bun run build      # genera dist/
```

## Comandos

| Comando | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo (hot reload) |
| `bun run build` | Genera `dist/` estático |
| `bun run preview` | Previsualiza el build de producción |
| `bun run db:init` | Recrea la DB desde schema + seed (¡borra datos!) |
| `bun run check` | Type-check con svelte-check |

## Estructura

```
hihive-v2/
├ db/
│  ├── schema.sql       # esquema de la DB
│  ├── seed.sql         # datos iniciales
│  └── hihive.db        # la DB (editable con DataGrip/DBeaver)
├ scripts/
│  └── init-db.ts       # crea la DB desde schema + seed
├ src/
│  ├── app.css          # estilos globales (extraídos del prototipo)
│  ├── app.html         # template HTML raíz
│  ├── lib/
│  │  ├── components/   # 22 componentes Svelte 5
│  │  └── server/
│  │     └── db.ts      # capa de acceso a SQLite (server-only)
│  └── routes/
│     ├── +layout.svelte     # layout raíz (importa CSS + paleta)
│     ├── +layout.server.ts  # carga site data global
│     ├── +page.server.ts    # carga todos los datos de la home
│     └── +page.svelte       # composición de la home
├ static/
│  ├── favicon.svg
│  └── img/             # imágenes (subir aquí)
├ vite.config.ts        # adapter-static → dist/
└ .mise.toml            # bun = "1.2"
```

## Personalización rápida

- **Paleta**: cambia `palette` en la tabla `site` → `terracotta` | `sage` | `midnight` | `paper`
- **Hero**: edita `hero_title`, `hero_sub`, `hero_photo`, `hero_meta_json` en `site`
- **Contacto**: edita `phone_display`, `phone_intl`, `email`, `address_*`, `hours` en `site`
- **Disponibilidad**: cambia `taken` y `free_date` en `desks` y `offices`
- **FAQ**: añade/edita filas en `faq`

## Notas

- El prototipo original de diseño está en `claude-design/project/` (React + Babel, solo referencia).
- `bun:sqlite` solo se importa desde `*.server.ts` → nunca llega al bundle cliente.
- El build usa `bun --bun run build` (el flag `--bun` es necesario para que Vite resuelva `bun:sqlite`).
- Las imágenes placeholder en `static/img/` son PNGs sólidos — reemplázalas con fotos reales.