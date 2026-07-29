-- schema.sql — Esquema de la base de datos HiHive v2 (PostgreSQL).
-- Edítalo con DataGrip/DBeaver (conectando al contenedor Docker).
-- Tras editar, ejecuta `bun run db:init` y `bun run build`.

-- ── Config global del sitio ─────────────────────────────────────
-- Una sola fila (id=1). Personaliza paleta, hero, contacto, etc.
CREATE TABLE IF NOT EXISTS site (
  id              INTEGER PRIMARY KEY CHECK (id = 1),
  -- Branding
  brand_name      TEXT NOT NULL DEFAULT 'HiHive Coworking',
  brand_em        TEXT NOT NULL DEFAULT 'Hive',          -- parte en cursiva del logo
  -- Hero
  hero_eyebrow    TEXT NOT NULL DEFAULT 'Coworking · Barcelona · Centro',
  hero_title      TEXT NOT NULL DEFAULT 'Trabaja tranquilo en un entorno agradable',
  hero_title_color TEXT NOT NULL DEFAULT 'rgb(121, 78, 59)',
  hero_title_font_size TEXT NOT NULL DEFAULT '110px',
  hero_title_italic INTEGER NOT NULL DEFAULT 1,           -- 0|1
  hero_sub        TEXT NOT NULL DEFAULT 'Un coworking junto a Plaça Catalunya para trabajar tranquilo con todos los servicios que necesitas, enfocado para quien busca un lugar de trabajo a largo plazo.',
  hero_sub_italic INTEGER NOT NULL DEFAULT 1,
  hero_photo      TEXT NOT NULL DEFAULT '/img/hero.png', -- ruta en static/
  -- Métricas del hero (4 items)
  hero_meta_json  TEXT NOT NULL DEFAULT '[{"k":"350 m²","l":"entre despachos<br />y zonas comunes"},{"k":"24/7","l":"acceso para miembros"},{"k":"1 Gbps","l":"fibra simétrica"},{"k":"2 min","l":"de Plaça Catalunya"}]',
  -- Paleta: terracotta | sage | midnight | paper
  palette         TEXT NOT NULL DEFAULT 'terracotta',
  -- Reserva
  reserva_intro  TEXT NOT NULL DEFAULT 'Escríbenos directamente por WhatsApp o Telegram. Estamos encantados de hablar contigo, resolver tus dudas y concertar una visita de las instalaciones.',
  phone_display  TEXT NOT NULL DEFAULT '640 723 018',
  phone_intl     TEXT NOT NULL DEFAULT '34640723018',     -- sin +, para wa.me / t.me
  wa_message     TEXT NOT NULL DEFAULT '¡Hola HiHive! Me gustaría reservar un espacio. ',
  -- Contacto
  address_line1  TEXT NOT NULL DEFAULT 'Carrer de Pelai, 9, Entresuelo',
  address_line2  TEXT NOT NULL DEFAULT '08001 Barcelona · Catalunya',
  address_short  TEXT NOT NULL DEFAULT 'Carrer de Pelai, 9.',
  address_city   TEXT NOT NULL DEFAULT 'Barcelona.',
  email           TEXT NOT NULL DEFAULT 'info@hihve.es',
  hours           TEXT NOT NULL DEFAULT 'Lunes a viernes · 09:00 - 14:00 / 16:00 - 19:00',
  map_query       TEXT NOT NULL DEFAULT 'Carrer de Pelai 9, Barcelona',
  -- Footer
  footer_tag      TEXT NOT NULL DEFAULT 'Un coworking de barrio junto a Plaça Catalunya, Barcelona.',
  footer_year     TEXT NOT NULL DEFAULT '2026',
  footer_version  TEXT NOT NULL DEFAULT 'v 2.0 · carrer de pelai 9'
);

-- ── Espacios (tarjetas principales: Mesas, Oficinas) ─────────────
CREATE TABLE IF NOT EXISTS spaces (
  id          TEXT PRIMARY KEY,            -- 'hotdesk' | 'oficina'
  name        TEXT NOT NULL,
  pre         TEXT,                        -- 'desde' (opcional)
  "desc"      TEXT NOT NULL,                -- 'desc' es keyword en SQL → quoted
  price       TEXT NOT NULL,               -- '160' | '700'
  unit        TEXT NOT NULL,               -- '€ + IVA'
  photo       TEXT NOT NULL,               -- ruta en static/
  label       TEXT NOT NULL,              -- texto sobre la foto
  featured    INTEGER NOT NULL DEFAULT 0,  -- 0|1 — tarjeta destacada (oscura)
  cta_label   TEXT NOT NULL,               -- 'Nuestras mesas' | 'Nuestras oficinas'
  sort_order  INTEGER NOT NULL DEFAULT 0,
  benefits    TEXT NOT NULL DEFAULT '[]'   -- JSON array de strings
);

-- ── Mesas individuales (disponibilidad) ─────────────────────────
CREATE TABLE IF NOT EXISTS desks (
  id        INTEGER PRIMARY KEY,           -- número de mesa
  taken     INTEGER NOT NULL DEFAULT 0,    -- 0=libre, 1=ocupada
  free_date TEXT                            -- ISO '2026-08-01' (si ocupada con fecha de liberación)
);

-- ── Oficinas privadas (disponibilidad + precio) ─────────────────
CREATE TABLE IF NOT EXISTS offices (
  id        INTEGER PRIMARY KEY,           -- número de oficina
  taken     INTEGER NOT NULL DEFAULT 0,
  price     TEXT NOT NULL,                 -- '960 € + IVA'
  free_date TEXT
);

-- ── Fotos por oficina ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS office_photos (
  id          SERIAL PRIMARY KEY,
  office_id   INTEGER NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  src         TEXT NOT NULL,               -- ruta en static/
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ── Galería de espacios (categorías + fotos) ────────────────────
CREATE TABLE IF NOT EXISTS gallery_categories (
  key         TEXT PRIMARY KEY,            -- 'despachos' | 'mesas' | 'comunes'
  label       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id          SERIAL PRIMARY KEY,
  category_key TEXT NOT NULL REFERENCES gallery_categories(key) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  src         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ── FAQ / Condiciones generales (acordeón) ──────────────────────
CREATE TABLE IF NOT EXISTS faq (
  id        SERIAL PRIMARY KEY,
  question  TEXT NOT NULL,
  answer    TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);