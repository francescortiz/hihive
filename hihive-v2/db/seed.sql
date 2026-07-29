-- seed.sql — Datos iniciales de HiHive v2 (PostgreSQL).
-- Ejecutar una sola vez para crear la DB: `bun run db:init`
-- Después edita la DB con DataGrip/DBeaver.

-- ── Site (fila única) ────────────────────────────────────────────
INSERT INTO site (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ── Espacios ────────────────────────────────────────────────────
INSERT INTO spaces (id, name, pre, "desc", price, unit, photo, label, featured, cta_label, sort_order, benefits) VALUES
('hotdesk', 'Mesas', NULL,
 'Tu escritorio del día, en una sala compartida con acceso 24/7.',
 '160', '€ + IVA', '/img/spaces/mesas.png', 'Sala Norte · luz natural', 0,
 'Nuestras mesas', 1,
 '["WiFi fibra simétrico 1 Gbps","Acceso 24/7","Acceso a sala de reuniones","Taquilla con llave"]'),
('oficina', 'Oficinas', 'desde',
 'Para equipos de 4 a 10 personas. Llave propia, mobiliario y acceso 24/7.',
 '700', '€ + IVA', '/img/spaces/oficinas.png', 'Estudio Mediterráneo · privada', 1,
 'Nuestras oficinas', 2,
 '["WiFi fibra simétrico 1 Gbps","Acceso 24/7","Acceso a sala de reuniones","Oficina privada con llave"]')
ON CONFLICT (id) DO NOTHING;

-- ── Mesas ────────────────────────────────────────────────────────
INSERT INTO desks (id, taken, free_date) VALUES
(1, 0, NULL),
(2, 1, '2026-08-01'),
(3, 0, NULL),
(4, 0, NULL),
(5, 1, '2026-07-22')
ON CONFLICT (id) DO NOTHING;

-- ── Oficinas ─────────────────────────────────────────────────────
INSERT INTO offices (id, taken, price, free_date) VALUES
(1, 0, '960 € + IVA', NULL),
(2, 1, '700 € + IVA', '2026-09-01'),
(3, 0, '1350 € + IVA', NULL),
(4, 0, '750 € + IVA', NULL),
(5, 0, '1650 € + IVA', NULL)
ON CONFLICT (id) DO NOTHING;

-- ── Fotos por oficina ───────────────────────────────────────────
-- Nota: las rutas apuntan a static/img/offices/. Sube ahí las fotos reales.
INSERT INTO office_photos (office_id, title, src, sort_order) VALUES
(1, 'Oficina 1 · entrada', '/img/offices/of1-1.png', 1),
(1, 'Oficina 1 · puestos', '/img/offices/of1-2.png', 2),
(1, 'Oficina 1 · ventana', '/img/offices/of1-3.png', 3),
(2, 'Oficina 2 · entrada', '/img/offices/of2-1.png', 1),
(2, 'Oficina 2 · puestos', '/img/offices/of2-2.png', 2),
(2, 'Oficina 2 · ventana', '/img/offices/of2-3.png', 3),
(3, 'Oficina 3 · entrada', '/img/offices/of3-1.png', 1),
(3, 'Oficina 3 · puestos', '/img/offices/of3-2.png', 2),
(3, 'Oficina 3 · ventana', '/img/offices/of3-3.png', 3),
(4, 'Oficina 4 · entrada', '/img/offices/of4-1.png', 1),
(4, 'Oficina 4 · puestos', '/img/offices/of4-2.png', 2),
(4, 'Oficina 4 · ventana', '/img/offices/of4-3.png', 3),
(5, 'Oficina 5 · entrada', '/img/offices/of5-1.png', 1),
(5, 'Oficina 5 · puestos', '/img/offices/of5-2.png', 2),
(5, 'Oficina 5 · ventana', '/img/offices/of5-3.png', 3)
ON CONFLICT DO NOTHING;

-- ── Galería ──────────────────────────────────────────────────────
INSERT INTO gallery_categories (key, label, sort_order) VALUES
('despachos', 'Oficinas', 1),
('mesas', 'Mesas', 2),
('comunes', 'Zonas comunes', 3)
ON CONFLICT (key) DO NOTHING;

INSERT INTO gallery_photos (category_key, title, src, sort_order) VALUES
('despachos', 'Despacho privado', '/img/gallery/despacho-1.png', 1),
('despachos', 'Oficina para equipos', '/img/gallery/despacho-2.png', 2),
('despachos', 'Sala de reuniones', '/img/gallery/despacho-3.png', 3),
('mesas', 'Sala Norte · luz natural', '/img/gallery/mesas-1.png', 1),
('mesas', 'Zona de concentración', '/img/gallery/mesas-2.png', 2),
('mesas', 'Mesas junto a la ventana', '/img/gallery/mesas-3.png', 3),
('comunes', 'Cocina y office', '/img/gallery/comunes-1.png', 1),
('comunes', 'Sala de descanso', '/img/gallery/comunes-2.png', 2),
('comunes', 'Recepción', '/img/gallery/comunes-3.png', 3)
ON CONFLICT DO NOTHING;

-- ── FAQ / Condiciones generales ──────────────────────────────────
INSERT INTO faq (question, answer, sort_order) VALUES
('¿Puedo reservar una mesa por un solo día?', 'Sí. Las mesas hotdesk se pueden reservar por día, semana o mes. El acceso es 24/7 una vez eres miembro.', 1),
('¿Qué incluye la cuota mensual?', 'Acceso 24/7 al espacio, WiFi fibra simétrico 1 Gbps, uso de la sala de reuniones (con reserva), taquilla con llave y acceso a las zonas comunes.', 2),
('¿Hay permanencia mínima?', 'No. Trabajamos sin contratos de permanencia. Solo avisamos con 30 días de antelación para no renovar el mes siguiente.', 3),
('¿Puedo alquilar una oficina para un equipo?', 'Sí. Nuestras oficinas privadas son para equipos de 4 a 10 personas, con llave propia, mobiliario y acceso 24/7.', 4),
('¿Cómo funciona la sala de reuniones?', 'Se reserva por franjas horarias y está incluida en la cuota. Los miembros pueden reservarla desde la web o por WhatsApp.', 5),
('¿Hay parking?', 'No tenemos parking propio, pero el coworking está a 2 minutos de Plaça Catalunya, con excelente conexión de transporte público y aparcamientos públicos cercanos.', 6)
ON CONFLICT DO NOTHING;