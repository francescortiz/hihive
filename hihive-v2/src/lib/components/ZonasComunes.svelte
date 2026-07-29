<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import Lightbox from '$lib/components/Lightbox.svelte';
  import ArrowIcon from '$lib/components/ArrowIcon.svelte';

  interface GalleryPhoto {
    category_key: string;
    title: string;
    src: string;
    sort_order: number;
  }

  let {
    commonsPhotos,
    onOpenGallery
  }: {
    commonsPhotos: GalleryPhoto[];
    onOpenGallery: (key: string) => void;
  } = $props();

  let lightboxIndex = $state<number | null>(null);

  function open(i: number) {
    lightboxIndex = i;
  }

  function close() {
    lightboxIndex = null;
  }

  function step(dir: number) {
    lightboxIndex = ((lightboxIndex ?? 0) + dir + commonsPhotos.length) % commonsPhotos.length;
  }
</script>

<Reveal id="zonas-comunes" className="commons-block">
  <div class="desk-head">
    <span class="eyebrow">Zonas · Compartidas</span>
    <h3 class="serif">Zonas comunes</h3>
  </div>
  <div class="commons-collage">
    {#each commonsPhotos as p, i}
      <div class="cc cc{i + 1}" role="button" tabindex="0" onclick={() => open(i)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(i); }}>
        <img src={p.src} alt={p.title} />
      </div>
    {/each}
  </div>
  <p class="commons-desc">Cocina totalmente equipada, sala de descanso y recepción para desconectar entre tareas.</p>
  <div class="commons-cta">
    <button type="button" class="btn ghost" onclick={() => onOpenGallery('comunes')}>
      Ver galería <ArrowIcon />
    </button>
  </div>
</Reveal>

<Lightbox photos={commonsPhotos} index={lightboxIndex} onClose={close} onStep={step} />
