# AGENTS.md — Guía para IAs en HiHive

Este archivo contiene el contexto y los procedimientos básicos para que cualquier agente de IA (como Junie) pueda trabajar en este proyecto de forma consistente.

## Contexto del Proyecto
HiHive es un coworking en Pelai 9, Barcelona. El sitio web es una aplicación estática (Single Page Application simulada con anclas) construida con HTML, CSS y Webpack.

## Estructura de Archivos Clave
- `index.html`: Página principal con todas las secciones y galerías genéricas.
- `despacho-X.html`: Páginas individuales para cada despacho (ej: `despacho-2.html`, `despacho-3.html`).
- `css/style.css`: Estilos globales.
- `webpack.config.prod.js`: Configuración para generar el sitio en la carpeta `dist`.
- `img/fotos/`: Directorio donde se organizan las imágenes por categorías (Despacho 1, Despacho 2, Mesas, Sala Pelayo, etc.).

## Skills (Habilidades Recomendadas)
Para mantener este proyecto, el agente debe dominar los siguientes procedimientos detallados en `.junie/skills.md`:
1. **skill_add_despacho**: Crear una nueva página de despacho desde una plantilla y enlazarla.
2. **skill_update_gallery**: Configurar el objeto `galleries` en el JavaScript del lightbox para incluir nuevas fotos.
3. **skill_build_config**: Sincronizar los archivos HTML con el plugin de copia de Webpack.

## Notas de Estilo
- Usar español para todo el contenido visible y comentarios.
- Mantener el diseño minimalista y limpio (beige `#f6e7c6`, azul `#0a66ff`).
- Las imágenes en las galerías deben tener `loading="lazy"`.
