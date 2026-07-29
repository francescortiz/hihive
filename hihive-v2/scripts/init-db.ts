/**
 * init-db.ts — Crea la base de datos PostgreSQL desde schema.sql + seed.sql.
 * Uso: `bun run db:init`
 * Idempotente: hace DROP de las tablas existentes y las recrea limpias.
 *
 * Requiere DATABASE_URL en .env (ver .env.example) y que el contenedor
 * Docker de Postgres esté arrancado: `./docker.sh up`
 */
import pg from 'pg';
import { readFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = resolve(__dirname, '..', 'db');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('✗ Falta DATABASE_URL en .env (ver .env.example)');
  process.exit(1);
}

const schema = readFileSync(join(DB_DIR, 'schema.sql'), 'utf-8');
const seed = readFileSync(join(DB_DIR, 'seed.sql'), 'utf-8');

const pool = new Pool({ connectionString: DATABASE_URL });
const client = await pool.connect();

try {
  // Limpiar tablas previas (orden inverso a las dependencias)
  await client.query(`
    DROP TABLE IF EXISTS
      faq,
      gallery_photos,
      gallery_categories,
      office_photos,
      offices,
      desks,
      spaces,
      site
    CASCADE;
  `);
  console.log('→ tablas anteriores borradas');

  // Aplicar schema
  await client.query(schema);
  console.log('✓ schema aplicado');

  // Aplicar seed
  await client.query(seed);
  console.log('✓ seed aplicado');

  // Verificar
  const { rows } = await client.query('SELECT COUNT(*) as n FROM spaces');
  console.log(`✓ DB lista (${rows[0].n} espacios)`);
} finally {
  client.release();
  await pool.end();
}