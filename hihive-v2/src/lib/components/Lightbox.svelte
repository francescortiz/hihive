<script lang="ts">
  let {
    photos,
    index,
    onClose,
    onStep
  }: {
    photos: { src: string; title: string }[];
    index: number | null;
    onClose: () => void;
    onStep: (dir: number) => void;
  } = $props();

  $effect(() => {
    if (index === null || !photos[index]) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if index !== null && photos[index]}
  <div class="light-overlay" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => { e.stopPropagation(); onClose(); }} onkeydown={() => {}}>
    <button class="light-close" onclick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Cerrar">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
    {#if photos.length > 1}
      <button class="light-nav prev" onclick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Anterior">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    {/if}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <figure class="light-figure" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <img src={photos[index].src} alt={photos[index].title || `Foto ${index + 1}`} />
      <figcaption>{photos[index].title ? `${photos[index].title} · ` : ''}{index + 1} / {photos.length}</figcaption>
    </figure>
    {#if photos.length > 1}
      <button class="light-nav next" onclick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Siguiente">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    {/if}
  </div>
{/if}
