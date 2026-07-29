/**
 * db.ts — Capa de acceso a SQLite para HiHive v2.
 *
 * Usa bun:sqlite (built-in, sin deps nativas). Solo se importa desde
 * ficheros *.server.ts, así que SvelteKit/Vite lo excluye del bundle
 * cliente y solo corre en build time (prerender).
 */
import { Database } from 'bun:sqlite';
import { resolve } from 'node:path';

// Durante el build, SvelteKit compila los .server.ts a .svelte-kit/output/server/...,
// así que __dirname no apunta a src/lib/server. Resolvemos desde el cwd del proyecto.
const DB_PATH = resolve(process.cwd(), 'db', 'hihive.db');

let _db: Database | null = null;

function db(): Database {
  if (_db) return _db;
  _db = new Database(DB_PATH, { readonly: true });
  _db.exec('PRAGMA foreign_keys = ON;');
  return _db;
}

// ── Tipos ────────────────────────────────────────────────────────
export interface Site {
  brand_name: string;
  brand_em: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_title_color: string;
  hero_title_font_size: string;
  hero_title_italic: number;
  hero_sub: string;
  hero_sub_italic: number;
  hero_photo: string;
  hero_meta_json: string;
  palette: string;
  reserva_intro: string;
  phone_display: string;
  phone_intl: string;
  wa_message: string;
  address_line1: string;
  address_line2: string;
  address_short: string;
  address_city: string;
  email: string;
  hours: string;
  map_query: string;
  footer_tag: string;
  footer_year: string;
  footer_version: string;
}

export interface Space {
  id: string;
  name: string;
  pre: string | null;
  desc: string;
  price: string;
  unit: string;
  photo: string;
  label: string;
  featured: number;
  cta_label: string;
  sort_order: number;
  benefits: string[]; // parseado de JSON
}

export interface Desk {
  id: number;
  taken: number;
  free_date: string | null;
}

export interface Office {
  id: number;
  taken: number;
  price: string;
  free_date: string | null;
}

export interface OfficePhoto {
  office_id: number;
  title: string;
  src: string;
  sort_order: number;
}

export interface GalleryCategory {
  key: string;
  label: string;
  sort_order: number;
}

export interface GalleryPhoto {
  category_key: string;
  title: string;
  src: string;
  sort_order: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

// ── Queries ──────────────────────────────────────────────────────
export function getSite(): Site {
  return db().query('SELECT * FROM site WHERE id = 1').get() as Site;
}

export function getSpaces(): Space[] {
  const rows = db()
    .query('SELECT * FROM spaces ORDER BY sort_order')
    .all() as (Omit<Space, 'benefits'> & { benefits: string })[];
  return rows.map((r) => {
    const { benefits, ...rest } = r;
    return { ...rest, benefits: JSON.parse(benefits ?? '[]') };
  });
}

// Nota: la columna benefits se almacena como JSON en un TEXT llamado
// "benefits" en el schema. SQLite devuelve el campo tal cual; lo
// parseamos aquí. (Ver corrección abajo.)
export function getDesks(): Desk[] {
  return db().query('SELECT * FROM desks ORDER BY id').all() as Desk[];
}

export function getOffices(): Office[] {
  return db().query('SELECT * FROM offices ORDER BY id').all() as Office[];
}

export function getOfficePhotos(officeId: number): OfficePhoto[] {
  return db()
    .query('SELECT * FROM office_photos WHERE office_id = ? ORDER BY sort_order')
    .all(officeId) as OfficePhoto[];
}

export function getAllOfficePhotos(): Record<number, OfficePhoto[]> {
  const offices = getOffices();
  const map: Record<number, OfficePhoto[]> = {};
  for (const o of offices) {
    map[o.id] = getOfficePhotos(o.id);
  }
  return map;
}

export function getGalleryCategories(): GalleryCategory[] {
  return db()
    .query('SELECT * FROM gallery_categories ORDER BY sort_order')
    .all() as GalleryCategory[];
}

export function getGalleryPhotos(categoryKey: string): GalleryPhoto[] {
  return db()
    .query('SELECT * FROM gallery_photos WHERE category_key = ? ORDER BY sort_order')
    .all(categoryKey) as GalleryPhoto[];
}

export function getGallery(): { category: GalleryCategory; photos: GalleryPhoto[] }[] {
  const cats = getGalleryCategories();
  return cats.map((category) => ({ category, photos: getGalleryPhotos(category.key) }));
}

export function getFaq(): FaqItem[] {
  return db().query('SELECT * FROM faq ORDER BY sort_order').all() as FaqItem[];
}

// ── Datos agregados para la home ──────────────────────────────────
export interface HomeData {
  site: Site;
  spaces: Space[];
  desks: Desk[];
  offices: Office[];
  officePhotos: Record<number, OfficePhoto[]>;
  gallery: { category: GalleryCategory; photos: GalleryPhoto[] }[];
  faq: FaqItem[];
}

export function getHomeData(): HomeData {
  return {
    site: getSite(),
    spaces: getSpaces(),
    desks: getDesks(),
    offices: getOffices(),
    officePhotos: getAllOfficePhotos(),
    gallery: getGallery(),
    faq: getFaq()
  };
}