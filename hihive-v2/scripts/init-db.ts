/**
 * init-db.ts — Crea la base de datos SQLite desde schema.sql + seed.sql.
 * Uso: `bun run db:init`
 * Idempotente: si la DB ya existe, la borra y la recrea limpia.
 */
import { Database } from 'bun:sqlite';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = resolve(__dirname, '..', 'db');
const DB_PATH = join(DB_DIR, 'hihive.db');

// Limpiar DB previa
if (existsSync(DB_PATH)) {
  rmSync(DB_PATH);
  console.log('→ DB anterior borrada');
}

// Crear DB nueva
const db = new Database(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

// Aplicar schema
const schema = readFileSync(join(DB_DIR, 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('✓ schema aplicado');

// Aplicar seed
const seed = readFileSync(join(DB_DIR, 'seed.sql'), 'utf-8');
db.exec(seed);
console.log('✓ seed aplicado');

// Verificar
const count = db.query('SELECT COUNT(*) as n FROM spaces').get() as { n: number };
console.log(`✓ DB lista en ${DB_PATH} (${count.n} espacios)`);

db.close();