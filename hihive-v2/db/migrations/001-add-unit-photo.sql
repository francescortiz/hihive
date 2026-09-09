-- 001-add-unit-photo.sql — Migración puntual NO destructiva: añade la columna
-- `photo` (nullable) a las tablas `desks` y `offices` y rellena las fotos por
-- defecto (placeholders). Idempotente: seguro ejecutarla más de una vez.
--
-- Ejecutar contra la DB viva (NO es `bun run db:init`, no borra datos):
--   docker exec -i hihive-pg psql -U hihive -d hihive < db/migrations/001-add-unit-photo.sql
-- (requiere el contenedor arrancado: `./docker.sh up`)
--
-- Tras editar, `bun run build` para regenerar el sitio estático.

BEGIN;

ALTER TABLE desks ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE offices ADD COLUMN IF NOT EXISTS photo TEXT;

-- Portada por defecto: placeholders en static/img/desks/
UPDATE desks SET photo = '/img/desks/mesa-' || id || '.png' WHERE photo IS NULL;

-- Portada por defecto: primera foto existente de cada oficina
UPDATE offices SET photo = '/img/offices/of' || id || '-1.png' WHERE photo IS NULL;

COMMIT;
