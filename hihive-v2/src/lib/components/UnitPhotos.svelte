<script lang="ts">
  import { asset } from '$lib/utils';
  import Lightbox from '$lib/components/Lightbox.svelte';

  interface OfficePhoto {
    office_id: number;
    title: string;
    src: string;
    sort_order: number;
  }

  let {
    photos,
    title,
    eyebrow,
    onClose
  }: {
    photos: OfficePhoto[];
    title: string;
    eyebrow: string;
    onClose: () => void;
  } = $props();

  let lightboxIndex = $state<number | null>(null);

  function open(idx: number) {
    lightboxIndex = idx;
  }

  function close() {
    lightboxIndex = null;
  }

  function step(dir: number) {
    lightboxIndex = ((lightboxIndex ?? 0) + dir + photos.length) % photos.length;
  }

  $effect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  });

  $effect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null && e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<div class="gal-overlay" onclick={onClose}>
  <div class="gal-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1" aria-label="Fotos de {title}">
    <button class="desk-close" onclick={onClose} aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>
    <div class="desk-head">
      <span class="eyebrow">{eyebrow}</span>
      <h3 class="serif">{title}</h3>
      <p>Fotos de ejemplo del espacio.</p>
    </div>
    <div class="gal-grid">
      {#each photos as p, i}
        <div class="gal-cell">
          <div class="gal-imgwrap" role="button" tabindex="0" onclick={() => open(i)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(i); }}>
            <img src={asset(p.src)} alt={p.title} />
          </div>
          <div class="gal-title-static">{p.title}</div>
        </div>
      {/each}
    </div>
  </div>
  <Lightbox {photos} index={lightboxIndex} onClose={close} onStep={step} />
</div>
