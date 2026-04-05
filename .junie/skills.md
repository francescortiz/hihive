# Skills y Procedimientos de HiHive

Este archivo describe las "habilidades" o procedimientos que un agente debe conocer para mantener el sitio web de forma consistente.

## skill_add_despacho: Añadir una nueva página de despacho
Para añadir un despacho (ej. "Despacho 4") que actualmente no tiene fotos:

1. **Crear HTML Individual**:
   - Copiar `despacho-3.html` como base para el nuevo archivo (ej: `despacho-4.html`).
   - Actualizar `<title>`, `<meta description>`, `<h2>` y `<p class="meta">` con la capacidad y precio adecuados.
   - Listar los archivos en `img/fotos/Despacho 4` para identificar las imágenes disponibles.
   - Reemplazar las imágenes en el `<div class="grid grid-3">`. Cada `<figure>` debe tener su `img` con `loading="lazy"` y su `figcaption`.
   - Asegurarse de que el script del final del archivo (Lightbox local) capture estas imágenes correctamente.

2. **Actualizar la Home (index.html)**:
   - Buscar el `<article class="card">` correspondiente al Despacho 4.
   - Reemplazar la imagen genérica `img/blank-white.svg` por una imagen real del despacho (ej: `img/fotos/Despacho 4/Portada.jpg`).
   - Envolver la imagen en un `<a>` que apunte al nuevo HTML.
   - Envolver el título `<h3>` en un `<a>` con la misma ruta.
   - Actualizar el script del Lightbox genérico (al final del archivo): añadir una nueva clave al objeto `galleries` (ej: `despacho4: [...]`) con todas las fotos del despacho para que se puedan navegar si fuera necesario (aunque la home por defecto navega a la página individual).

3. **Configuración del Build**:
   - En `webpack.config.prod.js`, añadir el nuevo archivo HTML a la lista de `patterns` del `CopyPlugin` para que se incluya en la carpeta de producción `dist`.

## skill_update_gallery: Gestión de Galerías y Lightbox
- Las galerías de la página de inicio (Zonas comunes, Mesas) se configuran en el script final de `index.html`.
- Cada galería es una clave en el objeto `galleries`. Cada ítem tiene `{src: 'path', caption: 'Texto'}`.
- Si se añaden nuevas fotos a una categoría (ej. Sala Pelayo), es imprescindible actualizar este objeto para que el lightbox muestre las fotos adicionales.

## skill_build_config: Verificación del proceso de Build
- El entorno de desarrollo usa `webpack.config.dev.js` y sirve los archivos desde la raíz.
- El entorno de producción (`npm run build`) utiliza `webpack.config.prod.js`.
- Es crucial que cualquier nuevo archivo estático (HTML, imágenes, etc.) esté contemplado en el `CopyPlugin` si no es procesado por otro plugin de Webpack.
