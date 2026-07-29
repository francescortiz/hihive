<script lang="ts">
  import { asset } from '$lib/utils';
  import Lightbox from '$lib/components/Lightbox.svelte';

  interface GalleryPhoto {
    category_key: string;
    title: string;
    src: string;
    sort_order: number;
  }

  interface GalleryCategory {
    key: string;
    label: string;
    sort_order: number;
  }

  interface GalleryItem {
    category: GalleryCategory;
    photos: GalleryPhoto[];
  }

  let {
    gallery,
    onClose,
    focusKey = ''
  }: {
    gallery: GalleryItem[];
    onClose: () => void;
    focusKey?: string;
  } = $props();

  let lightboxIndex = $state<number | null>(null);
  let modalRef = $state<HTMLDivElement | null>(null);

  const allPhotos = $derived(gallery.flatMap((cat) => cat.photos));

  const categoryOffsets = $derived.by(() => {
    const map: Record<string, number> = {};
    let offset = 0;
    for (const item of gallery) {
      map[item.category.key] = offset;
      offset += item.photos.length;
    }
    return map;
  });

  function open(idx: number) {
    lightboxIndex = idx;
  }

  function close() {
    lightboxIndex = null;
  }

  function step(dir: number) {
    lightboxIndex = ((lightboxIndex ?? 0) + dir + allPhotos.length) % allPhotos.length;
  }

  $effect(() => {
    if (!focusKey || !modalRef) return;
    const target = modalRef.querySelector(`.gal-cat[data-cat="${focusKey}"]`);
    if (target) {
      modalRef.scrollTop = Math.max(0, (target as HTMLElement).offsetTop - 24);
    }
  });

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
  <div
    class="gal-modal gal-modal--wide"
    bind:this={modalRef}
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    aria-label="Galería de espacios"
  >
    <button class="desk-close" onclick={onClose} aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>
    <div class="desk-head">
      <span class="eyebrow">HiHive · Barcelona</span>
      <h3 class="serif">Nuestros espacios</h3>
      <p>Despachos, mesas y zonas comunes. Haz clic en cada foto para verla en grande.</p>
    </div>

    {#each gallery as item}
      <div class="gal-cat" data-cat={item.category.key}>
        <div class="gal-cat-label">{item.category.label}</div>
        <div class="gal-grid">
          {#each item.photos as p, i}
            <div class="gal-cell">
              <div class="gal-imgwrap" role="button" tabindex="0" onclick={() => open(categoryOffsets[item.category.key] + i)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(categoryOffsets[item.category.key] + i); }}>
                <img src={asset(p.src)} alt={p.title} />
              </div>
              <div class="gal-title-static">{p.title}</div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <Lightbox photos={allPhotos} index={lightboxIndex} onClose={close} onStep={step} />
</div>
