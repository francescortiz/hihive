<script lang="ts">
  import ArrowIcon from '$lib/components/ArrowIcon.svelte';
  import CheckIcon from '$lib/components/CheckIcon.svelte';

  interface SpaceProp {
    id: string;
    name: string;
    pre: string | null;
    desc: string;
    price: string;
    unit: string;
    photo: string;
    label: string;
    featured: number;
    cta_label: string;
    benefits: string[];
  }

  let {
    space,
    onOpenGallery,
    onCta
  }: {
    space: SpaceProp;
    onOpenGallery: (category: string) => void;
    onCta: (id: string) => void;
  } = $props();

  const isFeatured = $derived(!!space.featured);
</script>

<article class="space-card {isFeatured ? 'featured' : ''}">
  <button
    type="button"
    class="space-thumb thumb-gallery"
    onclick={() => onOpenGallery(space.id === 'hotdesk' ? 'mesas' : 'despachos')}
    aria-label="Abrir galería de espacios"
  >
    <img class="space-photo" src={space.photo} alt={space.label} />
    <span class="label">{space.label}</span>
    <span class="gallery-hint">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      Ver galería
    </span>
  </button>
  <h3 class="space-name">{space.name}</h3>
  <p class="desc">{space.desc}</p>
  <div class="price-row">
    {#if space.pre}
      <span class="price-pre">{space.pre}</span>
    {/if}
    <span class="price">{space.price}</span>
    <span class="price-unit">{space.unit}</span>
  </div>
  <ul class="benefits">
    {#each space.benefits as b}
      <li><CheckIcon />{b}</li>
    {/each}
  </ul>
  <div class="space-cta">
    <button class="btn {isFeatured ? '' : 'ghost'}" onclick={() => onCta(space.id)}>
      {space.cta_label}
      <ArrowIcon />
    </button>
  </div>
</article>
