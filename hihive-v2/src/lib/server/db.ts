/**
 * db.ts — Capa de acceso a PostgreSQL para HiHive v2.
 *
 * Usa el driver `pg` (node-postgres, puro JS, sin deps nativas). Solo se
 * importa desde ficheros *.server.ts, así que SvelteKit/Vite lo excluye
 * del bundle cliente y solo corre en build time (prerender).
 *
 * La cadena de conexión se lee de process.env.DATABASE_URL (cargada
 * automáticamente por Bun desde .env).
 */
import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('Falta DATABASE_URL en .env (ver .env.example)');
}

let _pool: pg.Pool | null = null;

function pool(): pg.Pool {
  if (_pool) return _pool;
  _pool = new Pool({ connectionString: DATABASE_URL });
  return _pool;
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
  photo: string | null;
}

export interface Office {
  id: number;
  taken: number;
  price: string;
  free_date: string | null;
  photo: string | null;
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
export async function getSite(): Promise<Site> {
  const { rows } = await pool().query('SELECT * FROM site WHERE id = 1');
  return rows[0] as Site;
}

export async function getSpaces(): Promise<Space[]> {
  const { rows } = await pool().query('SELECT * FROM spaces ORDER BY sort_order');
  return rows.map((r) => {
    const { benefits, ...rest } = r;
    return { ...rest, benefits: JSON.parse(benefits ?? '[]') } as Space;
  });
}

export async function getDesks(): Promise<Desk[]> {
  const { rows } = await pool().query('SELECT * FROM desks ORDER BY id');
  return rows as Desk[];
}

export async function getOffices(): Promise<Office[]> {
  const { rows } = await pool().query('SELECT * FROM offices ORDER BY id');
  return rows as Office[];
}

export async function getOfficePhotos(officeId: number): Promise<OfficePhoto[]> {
  const { rows } = await pool().query(
    'SELECT office_id, title, src, sort_order FROM office_photos WHERE office_id = $1 ORDER BY sort_order',
    [officeId]
  );
  return rows as OfficePhoto[];
}

export async function getAllOfficePhotos(): Promise<Record<number, OfficePhoto[]>> {
  const { rows } = await pool().query(
    'SELECT office_id, title, src, sort_order FROM office_photos ORDER BY office_id, sort_order'
  );
  const map: Record<number, OfficePhoto[]> = {};
  for (const row of rows as OfficePhoto[]) {
    (map[row.office_id] ??= []).push(row);
  }
  return map;
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const { rows } = await pool().query(
    'SELECT * FROM gallery_categories ORDER BY sort_order'
  );
  return rows as GalleryCategory[];
}

export async function getGalleryPhotos(categoryKey: string): Promise<GalleryPhoto[]> {
  const { rows } = await pool().query(
    'SELECT category_key, title, src, sort_order FROM gallery_photos WHERE category_key = $1 ORDER BY sort_order',
    [categoryKey]
  );
  return rows as GalleryPhoto[];
}

export async function getGallery(): Promise<{ category: GalleryCategory; photos: GalleryPhoto[] }[]> {
  const [cats, photos] = await Promise.all([
    getGalleryCategories(),
    (async () => {
      const { rows } = await pool().query(
        'SELECT category_key, title, src, sort_order FROM gallery_photos ORDER BY sort_order'
      );
      return rows as GalleryPhoto[];
    })()
  ]);
  return cats.map((category) => ({
    category,
    photos: photos.filter((p) => p.category_key === category.key)
  }));
}

export async function getFaq(): Promise<FaqItem[]> {
  const { rows } = await pool().query('SELECT * FROM faq ORDER BY sort_order');
  return rows as FaqItem[];
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

export async function getHomeData(): Promise<HomeData> {
  const [site, spaces, desks, offices, officePhotos, gallery, faq] = await Promise.all([
    getSite(),
    getSpaces(),
    getDesks(),
    getOffices(),
    getAllOfficePhotos(),
    getGallery(),
    getFaq()
  ]);
  return { site, spaces, desks, offices, officePhotos, gallery, faq };
}