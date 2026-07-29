// app.jsx — HiHive Coworking landing
// NOTE: all photos below are example/placeholder images to guide layout.
// Replace SPACES / SPACE_CATEGORIES / DESKS / OFFICES with data read from
// your database — the `photo` fields just need real image URLs.
const { useState, useEffect, useRef } = React;

// Example photo helper (stable per seed) — swap for real DB-backed URLs.
function ph(seed, w = 800, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// ── DATA ──────────────────────────────────────────────────────
const SPACES = [
{
  id: "hotdesk",
  name: "Mesas",
  desc: "Tu escritorio del día, en una sala compartida con acceso 24/7.",
  price: "160",
  unit: "€ + IVA",
  photo: ph("hihive-mesas-cover", 700, 500),
  label: "Sala Norte · luz natural",
  featured: false,
  benefits: [
  "WiFi fibra simétrico 1 Gbps",
  "Acceso 24/7",
  "Acceso a sala de reuniones",
  "Taquilla con llave"]

},
{
  id: "oficina",
  name: "Oficinas",
  pre: "desde",
  desc: "Para equipos de 4 a 10 personas. Llave propia, mobiliario y acceso 24/7.",
  price: "700",
  unit: "€ + IVA",
  photo: ph("hihive-oficinas-cover", 700, 500),
  label: "Estudio Mediterráneo · privada",
  featured: true,
  benefits: [
  "WiFi fibra simétrico 1 Gbps",
  "Acceso 24/7",
  "Acceso a sala de reuniones",
  "Oficina privada con llave"]

}];


// ── ICONS ─────────────────────────────────────────────────────
const Icon = {
  arrow: (p) =>
  <svg className="arrow" {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>,

  check: (p) =>
  <svg className="check" {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,

  pin: (p) =>
  <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,

  ig: (p) =>
  <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,

  li: (p) =>
  <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10z" /></svg>,

  x: (p) =>
  <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.52 7.46L22 22h-6.84l-4.78-6.26L4.8 22H2l6.97-7.97L2 2h6.96l4.32 5.71L18.24 2zm-1.2 18h1.86L7.05 4H5.08l11.96 16z" /></svg>,

  whatsapp: (p) =>
  <svg {...p} width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981a9.864 9.864 0 00-.27-.726zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>,

  telegram: (p) =>
  <svg {...p} width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>

};

// ── REVEAL ON SCROLL ──────────────────────────────────────────
function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf1 = 0,raf2 = 0,t = 0,io = null;
    const reveal = () => setHidden(false);
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;
        if (r.top < vh && r.bottom > 0) return;
        setHidden(true);
        if (typeof IntersectionObserver === "undefined") {reveal();return;}
        io = new IntersectionObserver(
          ([e]) => {if (e.isIntersecting) {reveal();io.disconnect();}},
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        io.observe(el);
        t = setTimeout(reveal, 1600);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
      io && io.disconnect();
    };
  }, []);
  const d = delay ? `d${delay}` : "";
  return <Tag ref={ref} className={`reveal ${d} ${hidden ? "pre" : ""} ${className}`} {...rest}>{children}</Tag>;
}

// ── LIGHTBOX (view-only photo viewer with prev/next) ──────────
function useLightbox(photos) {
  const [light, setLight] = useState(null);
  const open = (idx) => setLight(idx);
  const close = () => setLight(null);
  const step = (dir) => setLight((i) => i === null ? i : (i + dir + photos.length) % photos.length);
  useEffect(() => {
    if (light === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [light]);
  return { light, open, close, step };
}

function Lightbox({ photos, index, onClose, onStep }) {
  if (index === null || !photos[index]) return null;
  const p = photos[index];
  return (
    <div className="light-overlay" onClick={(e) => {e.stopPropagation();onClose();}}>
      <button className="light-close" onClick={(e) => {e.stopPropagation();onClose();}} aria-label="Cerrar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
      {photos.length > 1 &&
      <button className="light-nav prev" onClick={(e) => {e.stopPropagation();onStep(-1);}} aria-label="Anterior">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      }
      <figure className="light-figure" onClick={(e) => e.stopPropagation()}>
        <img src={p.src} alt={p.title || `Foto ${index + 1}`} />
        <figcaption>{p.title ? `${p.title} · ` : ""}{index + 1} / {photos.length}</figcaption>
      </figure>
      {photos.length > 1 &&
      <button className="light-nav next" onClick={(e) => {e.stopPropagation();onStep(1);}} aria-label="Siguiente">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      }
    </div>);

}

// ── NAV ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`} data-screen-label="Nav">
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="HiHive — inicio">
          <span className="brand-name">Hi<em>Hive</em> Coworking</span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          <a href="#top">Inicio</a>
          <a href="#espacios">Espacios</a>
          <a href="#reserva">Reserva</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a className="btn nav-cta" href="#reserva">
          Contacta con nosotros
          <Icon.arrow />
        </a>
      </div>
    </header>);

}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  const [spacesGallery, setSpacesGallery] = useState(false);
  return (
    <section className="hero" id="top" data-screen-label="Hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <Reveal className="eyebrow">Coworking · Barcelona · Centro</Reveal>
            <Reveal delay={1}>
              <h1 className="serif" style={{ color: "rgb(121, 78, 59)", fontFamily: "\"Instrument Serif\"", fontSize: "110px", fontStyle: "italic" }}>Trabaja tranquilo en un entorno agradable</h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="hero-sub" style={{ fontStyle: "italic" }}>Un coworking junto a Plaça Catalunya para trabajar tranquilo con todos los servicios que necesitas, enfocado para quien busca un lugar de trabajo a largo plazo.</p>
            </Reveal>
            <Reveal delay={3} className="hero-actions">
              <a className="btn lg accent" href="#reserva">
                Reserva tu lugar <Icon.arrow />
              </a>
              <button type="button" className="btn lg ghost" onClick={() => setSpacesGallery(true)}>Galería</button>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div className="hero-visual">
              <img className="hero-photo" src={ph("hihive-hero", 900, 1125)} alt="Vista del coworking HiHive" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={3}>
          <div className="hero-meta">
            <div className="item"><div className="k serif">350 m²</div><div className="l">entre despachos<br />y zonas comunes</div></div>
            <div className="item"><div className="k serif">24/7</div><div className="l">acceso para miembros</div></div>
            <div className="item"><div className="k serif">1 Gbps</div><div className="l">fibra simétrica</div></div>
            <div className="item"><div className="k serif">2 min</div><div className="l">de Plaça Catalunya</div></div>
          </div>
        </Reveal>
      </div>
      {spacesGallery && <SpacesGallery onClose={() => setSpacesGallery(false)} />}
    </section>);

}

// ── SPACES GALLERY (Ver espacios — categorías, fotos de ejemplo) ──
const SPACE_CATEGORIES = [
{
  key: "despachos",
  label: "Oficinas",
  photos: [
  { title: "Despacho privado", src: ph("hihive-oficina-1", 800, 600) },
  { title: "Oficina para equipos", src: ph("hihive-oficina-2", 800, 600) },
  { title: "Sala de reuniones", src: ph("hihive-oficina-3", 800, 600) }]

},
{
  key: "mesas",
  label: "Mesas",
  photos: [
  { title: "Sala Norte · luz natural", src: ph("hihive-mesas-1", 800, 600) },
  { title: "Zona de concentración", src: ph("hihive-mesas-2", 800, 600) },
  { title: "Mesas junto a la ventana", src: ph("hihive-mesas-3", 800, 600) }]

},
{
  key: "comunes",
  label: "Zonas comunes",
  photos: [
  { title: "Cocina y office", src: ph("hihive-comunes-1", 800, 600) },
  { title: "Sala de descanso", src: ph("hihive-comunes-2", 800, 600) },
  { title: "Recepción", src: ph("hihive-comunes-3", 800, 600) }]

}];


function SpacesGallery({ onClose, focusKey }) {
  const allPhotos = SPACE_CATEGORIES.flatMap((c) => c.photos);
  const { light, open, close, step } = useLightbox(allPhotos);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!focusKey) return;
    const modal = modalRef.current;
    if (!modal) return;
    const target = modal.querySelector(`.gal-cat[data-cat="${focusKey}"]`);
    if (target) modal.scrollTop = Math.max(0, target.offsetTop - 24);
  }, [focusKey]);

  useEffect(() => {
    const onKey = (e) => {if (light === null && e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {window.removeEventListener("keydown", onKey);document.body.style.overflow = "";};
  }, [onClose, light]);

  let offset = 0;

  return (
    <div className="gal-overlay" onClick={onClose}>
      <div className="gal-modal gal-modal--wide" ref={modalRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Galería de espacios">
        <button className="desk-close" onClick={onClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="desk-head">
          <span className="eyebrow">HiHive · Barcelona</span>
          <h3 className="serif">Nuestros espacios</h3>
          <p>Despachos, mesas y zonas comunes. Haz clic en cada foto para verla en grande.</p>
        </div>

        {SPACE_CATEGORIES.map((cat) => {
          const start = offset;
          offset += cat.photos.length;
          return (
            <div className="gal-cat" data-cat={cat.key} key={cat.key}>
              <div className="gal-cat-label">{cat.label}</div>
              <div className="gal-grid">
                {cat.photos.map((p, i) =>
                <div className="gal-cell" key={i}>
                    <div className="gal-imgwrap" onClick={() => open(start + i)}>
                      <img src={p.src} alt={p.title} />
                    </div>
                    <div className="gal-title-static">{p.title}</div>
                  </div>
                )}
              </div>
            </div>);

        })}
      </div>
      <Lightbox photos={allPhotos} index={light} onClose={close} onStep={step} />
    </div>);

}

// ── ESPACIOS ──────────────────────────────────────────────────
function Espacios({ onReserve }) {
  const [spacesGallery, setSpacesGallery] = useState(null); // null | category key to focus
  const commonsPhotos = SPACE_CATEGORIES.find((c) => c.key === "comunes").photos;
  const commonsLB = useLightbox(commonsPhotos);

  const handleCta = (s) => {
    const targetId = s.id === "hotdesk" ? "nuestras-mesas" : s.id === "oficina" ? "nuestras-oficinas" : null;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else
    onReserve(s.id);
  };

  return (
    <section id="espacios" data-screen-label="Espacios y tarifas">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="eyebrow">02 · Espacios y tarifas</div>
              <h2 className="serif">Dos formas de instalarte.</h2>
            </div>
          </div>
        </Reveal>

        <div className="spaces-grid">
          {SPACES.map((s, i) =>
          <Reveal key={s.id} delay={i + 1}>
              <article className={`space-card ${s.featured ? "featured" : ""}`}>
                <button type="button" className={`space-thumb thumb-gallery`} onClick={() => setSpacesGallery(s.id === "hotdesk" ? "mesas" : "despachos")} aria-label="Abrir galería de espacios">
                  <img className="space-photo" src={s.photo} alt={s.label} />
                  <span className="label">{s.label}</span>
                  <span className="gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Ver galería
                  </span>
                </button>
                <h3 className="space-name">{s.name}</h3>
                <p className="desc">{s.desc}</p>
                <div className="price-row">
                  {s.pre && <span className="price-pre">{s.pre}</span>}
                  <span className="price">{s.price}</span>
                  <span className="price-unit">{s.unit}</span>
                </div>
                <ul className="benefits">
                  {s.benefits.map((b, j) =>
                <li key={j}><Icon.check />{b}</li>
                )}
                </ul>
                <div className="space-cta">
                  <button className={`btn ${s.featured ? "" : "ghost"}`} onClick={() => handleCta(s)}>
                    {s.featured ? "Nuestras oficinas" : "Nuestras mesas"}
                    <Icon.arrow />
                  </button>
                </div>
              </article>
            </Reveal>
          )}
        </div>

        <DeskBoard onReserve={onReserve} />
        <OfficeBoard onReserve={onReserve} />

        <Reveal id="zonas-comunes" className="commons-block">
          <div className="desk-head">
            <span className="eyebrow">Zonas · Compartidas</span>
            <h3 className="serif">Zonas comunes</h3>
          </div>
          <div className="commons-collage">
            {commonsPhotos.map((p, i) =>
            <div className={`cc cc${i + 1}`} key={i} onClick={() => commonsLB.open(i)}>
                <img src={p.src} alt={p.title} />
              </div>
            )}
          </div>
          <p className="commons-desc">Cocina totalmente equipada, sala de descanso y recepción para desconectar entre tareas.</p>
          <div className="commons-cta">
            <button type="button" className="btn ghost" onClick={() => setSpacesGallery("comunes")}>
              Ver galería <Icon.arrow />
            </button>
          </div>
        </Reveal>
      </div>
      {spacesGallery !== null && <SpacesGallery focusKey={spacesGallery} onClose={() => setSpacesGallery(null)} />}
      <Lightbox photos={commonsPhotos} index={commonsLB.light} onClose={commonsLB.close} onStep={commonsLB.step} />
    </section>);

}

// ── AVAILABILITY BOARDS (Nuestras mesas / oficinas — inline) ──
// Example data — replace with live availability from your database.
const DESKS = [
{ id: 1, taken: false },
{ id: 2, taken: true, freeDate: "2026-08-01" },
{ id: 3, taken: false },
{ id: 4, taken: false },
{ id: 5, taken: true, freeDate: "2026-07-22" }];

const OFFICES = [
{ id: 1, taken: false, price: "960 € + IVA" },
{ id: 2, taken: true, price: "700 € + IVA", freeDate: "2026-09-01" },
{ id: 3, taken: false, price: "1350 € + IVA" },
{ id: 4, taken: false, price: "750 € + IVA" },
{ id: 5, taken: false, price: "1650 € + IVA" }];

// Example photos per office, keyed by office id — swap for real DB photos.
const OFFICE_PHOTOS = {
  1: [{ title: "Oficina 1 · entrada", src: ph("hihive-of1-1", 800, 600) }, { title: "Oficina 1 · puestos", src: ph("hihive-of1-2", 800, 600) }, { title: "Oficina 1 · ventana", src: ph("hihive-of1-3", 800, 600) }],
  2: [{ title: "Oficina 2 · entrada", src: ph("hihive-of2-1", 800, 600) }, { title: "Oficina 2 · puestos", src: ph("hihive-of2-2", 800, 600) }, { title: "Oficina 2 · ventana", src: ph("hihive-of2-3", 800, 600) }],
  3: [{ title: "Oficina 3 · entrada", src: ph("hihive-of3-1", 800, 600) }, { title: "Oficina 3 · puestos", src: ph("hihive-of3-2", 800, 600) }, { title: "Oficina 3 · ventana", src: ph("hihive-of3-3", 800, 600) }],
  4: [{ title: "Oficina 4 · entrada", src: ph("hihive-of4-1", 800, 600) }, { title: "Oficina 4 · puestos", src: ph("hihive-of4-2", 800, 600) }, { title: "Oficina 4 · ventana", src: ph("hihive-of4-3", 800, 600) }],
  5: [{ title: "Oficina 5 · entrada", src: ph("hihive-of5-1", 800, 600) }, { title: "Oficina 5 · puestos", src: ph("hihive-of5-2", 800, 600) }, { title: "Oficina 5 · ventana", src: ph("hihive-of5-3", 800, 600) }]
};

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function AvailabilityBoard({ boardId, eyebrow, title, desc, items, unitWord, priceLabel, photoPrefix }) {
  const [photosFor, setPhotosFor] = useState(null); // unit id whose photos are open

  return (
    <Reveal id={boardId} className="desk-board">
      <div className="desk-head">
        <span className="eyebrow">{eyebrow}</span>
        <h3 className="serif">{title}</h3>
        {desc && <p>{desc}</p>}
      </div>

      <div className="desk-row" role="group" aria-label={`Mapa de ${unitWord}s`}>
        {items.map((d) => {
          const state = d.taken ? "taken" : "free";
          const price = d.price || priceLabel;
          const statusText = d.taken ? d.freeDate ? `Libre ${fmtDate(d.freeDate)}` : "Ocupada" : "Libre";
          return (
            <div className="desk-wrap" key={d.id}>
              {photoPrefix ?
              <button
                type="button"
                className={`desk desk--${state}${price ? " desk--cornernum" : ""} desk--clickable`}
                onClick={() => setPhotosFor(d.id)}
                aria-label={`Ver fotos de ${unitWord} ${d.id}`}>
                <span className="desk-num">{d.id}</span>
                {price && <span className="desk-price">{price}</span>}
                <span className="desk-tag"><i className="desk-dot" />{statusText}</span>
                <span className="desk-photos-hint">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  Ver fotos
                </span>
              </button> :

              <div
                className={`desk desk--${state}${price ? " desk--cornernum" : ""}`}
                aria-label={`${unitWord} ${d.id}${d.taken ? " (ocupada)" : ""}`}>
                <span className="desk-num">{d.id}</span>
                {price && <span className="desk-price">{price}</span>}
                <span className="desk-tag"><i className="desk-dot" />{statusText}</span>
              </div>
              }
            </div>);
        })}
      </div>
      {photoPrefix && photosFor !== null &&
      <UnitPhotos
        photos={OFFICE_PHOTOS[photosFor] || []}
        title={`${unitWord.charAt(0).toUpperCase() + unitWord.slice(1)} ${photosFor}`}
        eyebrow={`${title} · Fotos`}
        onClose={() => setPhotosFor(null)} />
      }
    </Reveal>);

}

function DeskBoard({ onReserve }) {
  return (
    <AvailabilityBoard
      boardId="nuestras-mesas"
      eyebrow="Mesas · Individuales"
      title="Nuestras mesas"
      desc=""
      items={DESKS}
      unitWord="mesa"
      priceLabel="160 € + IVA" />);

}

function OfficeBoard({ onReserve }) {
  return (
    <AvailabilityBoard
      boardId="nuestras-oficinas"
      eyebrow="Oficinas · Privadas"
      title="Nuestras oficinas"
      desc=""
      items={OFFICES}
      unitWord="oficina"
      photoPrefix="oficina" />);

}

// ── UNIT PHOTOS (fotos de ejemplo de una oficina concreta) ────
function UnitPhotos({ photos, title, eyebrow, onClose }) {
  const { light, open, close, step } = useLightbox(photos);

  useEffect(() => {
    const onKey = (e) => {if (light === null && e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {window.removeEventListener("keydown", onKey);document.body.style.overflow = "";};
  }, [onClose, light]);

  return (
    <div className="gal-overlay" onClick={onClose}>
      <div className="gal-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Fotos de ${title}`}>
        <button className="desk-close" onClick={onClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="desk-head">
          <span className="eyebrow">{eyebrow}</span>
          <h3 className="serif">{title}</h3>
          <p>Fotos de ejemplo del espacio.</p>
        </div>
        <div className="gal-grid">
          {photos.map((p, i) =>
          <div className="gal-cell" key={i}>
              <div className="gal-imgwrap" onClick={() => open(i)}>
                <img src={p.src} alt={p.title} />
              </div>
              <div className="gal-title-static">{p.title}</div>
            </div>
          )}
        </div>
      </div>
      <Lightbox photos={photos} index={light} onClose={close} onStep={step} />
    </div>);

}

// ── RESERVA CHANNELS (WhatsApp / Telegram) ────────────────────
const RESERVA_PHONE_DISPLAY = "640 723 018";
const RESERVA_PHONE_INTL = "34640723018"; // +34
const RESERVA_WA_MSG = encodeURIComponent("¡Hola HiHive! Me gustaría reservar un espacio. ");

function ReservaChannels() {
  return (
    <div className="channels-card">
      <div className="channels-head">
        <span className="eyebrow">Escríbenos</span>
        <h3 className="channels-phone serif">Reserva en un mensaje</h3>
        <p className="channels-note"></p>
      </div>
      <div className="channels-list">
        <a
          className="channel channel--wa"
          href={`https://wa.me/${RESERVA_PHONE_INTL}?text=${RESERVA_WA_MSG}`}
          target="_blank" rel="noopener">
          
          <span className="channel-ico"><Icon.whatsapp /></span>
          <span className="channel-body">
            <span className="channel-name">WhatsApp</span>
            <span className="channel-sub">Chatea con nosotros ahora mismo</span>
          </span>
          <Icon.arrow />
        </a>
        <a
          className="channel channel--tg"
          href={`https://t.me/+${RESERVA_PHONE_INTL}`}
          target="_blank" rel="noopener">
          
          <span className="channel-ico"><Icon.telegram /></span>
          <span className="channel-body">
            <span className="channel-name">Telegram</span>
            <span className="channel-sub">Escríbenos por Telegram</span>
          </span>
          <Icon.arrow />
        </a>
      </div>
    </div>);

}

function Reserva() {
  return (
    <section id="reserva" className="reserva" data-screen-label="Reserva online">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="eyebrow">03 · Reserva</div>
              <h2 className="serif">Contacta con nosotros</h2>
            </div>
          </div>
        </Reveal>
        <div className="reserva-grid">
          <Reveal className="reserva-left">
            <p>Escríbenos directamente por WhatsApp o Telegram. Estamos encantados de hablar contigo, resolver tus dudas y concertar una visita de las instalaciones.</p>
          </Reveal>
          <Reveal delay={2}>
            <ReservaChannels />
          </Reveal>
        </div>
      </div>
    </section>);

}

// ── CONTACTO ──────────────────────────────────────────────────
function Contacto() {
  return (
    <section id="contacto" data-screen-label="Contacto">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="eyebrow">04 · Visítanos</div>
              <h2 className="serif">Carrer de Pelai, 9.<br />Barcelona.</h2>
            </div>
          </div>
        </Reveal>

        <div className="contact-grid">
          <Reveal className="contact-info">
            <dl>
              <div>
                <dt>Dirección</dt>
                <dd>Carrer de Pelai, 9, Entresuelo<br />08001 Barcelona · Catalunya</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd><a href="mailto:info@hihve.es">info@hihve.es</a></dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd><a href="tel:+34640723018">+34 640 723 018</a></dd>
              </div>
              <div>
                <dt>Horario de atención al cliente</dt>
                <dd style={{ fontFamily: "Geist", fontSize: 15, lineHeight: 1.7 }}>
                  Lunes a viernes · 09:00 - 14:00 / 16:00 - 19:00
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={1}>
            <div className="map-wrap">
              <iframe
                title="Mapa HiHive Coworking"
                src="https://maps.google.com/maps?q=Carrer%20de%20Pelai%209%2C%20Barcelona&z=17&hl=es&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
              
              <div className="map-overlay">
                <div className="t">HiHive Coworking</div>
                <div className="s">Carrer de Pelai 9 · Barcelona</div>
                <a href="https://www.google.com/maps/search/?api=1&query=Carrer%20de%20Pelai%209%2C%20Barcelona" target="_blank" rel="noopener">
                  Cómo llegar <Icon.arrow />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div className="container foot-grid">
        <div className="col-brand">
          <div className="foot-brand-name">Hi<em>Hive</em> Coworking</div>
          <p className="foot-tag">Un coworking de barrio junto a Plaça Catalunya, Barcelona.</p>
        </div>
        <div className="foot-col">
          <h4>Espacios</h4>
          <a href="#espacios">Mesas</a>
          <a href="#espacios">Oficina privada</a>
        </div>
        <div className="foot-col">
          <h4>Información</h4>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <a href="#">Aviso legal</a>
          <a href="#">Privacidad</a>
          <a href="#">Cookies</a>
        </div>
      </div>
      <div className="container foot-bot">
        <span>© 2026 HiHive Coworking · Hecho en Barcelona</span>
        <span className="mono">v 2.0 · carrer de pelai 9</span>
      </div>
    </footer>);

}

// ── PALETTES ──────────────────────────────────────────────────
const PALETTES = {
  terracotta: { bg: "#f5f0ea", bgElev: "#faf6f0", ink: "#2a2520", inkSoft: "#5b5249", line: "#e5dccf", sand: "#e8ddd0", accent: "#b86b4a", accentDeep: "#8f4f33", accentSoft: "#f0d9cb" },
  sage: { bg: "#f5f5f0", bgElev: "#fafaf4", ink: "#1f2620", inkSoft: "#4f5a4d", line: "#dbe0d4", sand: "#dbe0d4", accent: "#6e8a64", accentDeep: "#4d6647", accentSoft: "#d1dccb" },
  midnight: { bg: "#0e1116", bgElev: "#161b22", ink: "#f0eee8", inkSoft: "#9aa0a8", line: "#252b34", sand: "#1b2029", accent: "#d4a878", accentDeep: "#b78a5a", accentSoft: "#3a2e22" },
  paper: { bg: "#ffffff", bgElev: "#f7f7f5", ink: "#0a0a0a", inkSoft: "#5a5a58", line: "#e5e5e1", sand: "#ececea", accent: "#3a5a9f", accentDeep: "#23437a", accentSoft: "#d6dff0" }
};

function applyPalette(p) {
  const r = document.documentElement.style;
  r.setProperty("--bg", p.bg);
  r.setProperty("--bg-elev", p.bgElev);
  r.setProperty("--ink", p.ink);
  r.setProperty("--ink-soft", p.inkSoft);
  r.setProperty("--line", p.line);
  r.setProperty("--sand", p.sand);
  r.setProperty("--accent", p.accent);
  r.setProperty("--accent-deep", p.accentDeep);
  r.setProperty("--accent-soft", p.accentSoft);
}

// ── ROOT ──────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "terracotta",
  "heroStyle": "split",
  "showGrain": true,
  "heroLineHeight": 1.04
} /*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    applyPalette(PALETTES[t.palette] || PALETTES.terracotta);
  }, [t.palette]);

  useEffect(() => {
    document.body.style.setProperty("--grain", t.showGrain ? "0.6" : "0");
    document.body.classList.toggle("no-grain", !t.showGrain);
  }, [t.showGrain]);

  useEffect(() => {
    document.body.dataset.hero = t.heroStyle;
  }, [t.heroStyle]);

  useEffect(() => {
    document.documentElement.style.setProperty("--hero-lh", String(t.heroLineHeight));
  }, [t.heroLineHeight]);

  const handleReserve = () => {
    const el = document.getElementById("reserva");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <Nav />
      <Hero />
      <Espacios onReserve={handleReserve} />
      <Reserva />
      <Contacto />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Paleta" />
        <TweakColor
          label="Tema"
          value={t.palette === "terracotta" ? "#b86b4a" : t.palette === "sage" ? "#6e8a64" : t.palette === "midnight" ? "#d4a878" : "#3a5a9f"}
          options={["#b86b4a", "#6e8a64", "#d4a878", "#3a5a9f"]}
          onChange={(v) => {
            const map = { "#b86b4a": "terracotta", "#6e8a64": "sage", "#d4a878": "midnight", "#3a5a9f": "paper" };
            setTweak("palette", map[v] || "terracotta");
          }} />
        
        <TweakSection label="Hero" />
        <TweakRadio
          label="Layout"
          value={t.heroStyle}
          options={["split", "stack"]}
          onChange={(v) => setTweak("heroStyle", v)} />
        <TweakSlider
          label="Interlineado del titular"
          min={0.85} max={1.5} step={0.01}
          value={t.heroLineHeight}
          onChange={(v) => setTweak("heroLineHeight", v)} />
        
        <TweakSection label="Detalles" />
        <TweakToggle label="Grano de papel" value={t.showGrain} onChange={(v) => setTweak("showGrain", v)} />
      </TweaksPanel>
    </>);

}

// ── Hero-stack variant via class on body ──────────────────────
const heroStackCSS = `
  body[data-hero="stack"] .hero-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  body[data-hero="stack"] .hero-grid > div:first-child h1.serif {
    font-size: clamp(64px, 14vw, 180px);
  }
  body[data-hero="stack"] .hero-visual {
    aspect-ratio: 16 / 7;
    margin-top: 8px;
  }
  body.no-grain::before { display: none; }
`;
const styleTag = document.createElement("style");
styleTag.textContent = heroStackCSS;
document.head.appendChild(styleTag);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
