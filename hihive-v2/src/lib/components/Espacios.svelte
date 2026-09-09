<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import SpaceCard from './SpaceCard.svelte';
  import AvailabilityBoard from './AvailabilityBoard.svelte';
  import ZonasComunes from './ZonasComunes.svelte';
  import SpacesGallery from './SpacesGallery.svelte';

  interface Space {
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

  interface Desk {
    id: number;
    taken: number;
    free_date: string | null;
    photo: string | null;
  }

  interface Office {
    id: number;
    taken: number;
    price: string;
    free_date: string | null;
    photo: string | null;
  }

  interface OfficePhoto {
    office_id: number;
    title: string;
    src: string;
    sort_order: number;
  }

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
    spaces,
    desks,
    offices,
    officePhotos,
    gallery
  }: {
    spaces: Space[];
    desks: Desk[];
    offices: Office[];
    officePhotos: Record<number, OfficePhoto[]>;
    gallery: GalleryItem[];
  } = $props();

  let spacesGallery = $state<string | null>(null);

  const commonsPhotos = $derived(
    gallery.find((cat) => cat.category.key === 'comunes')?.photos ?? []
  );

  function handleOpenGallery(key: string) {
    spacesGallery = key;
  }

  function handleCta(id: string) {
    let targetId: string | null = null;
    if (id === 'hotdesk') targetId = 'nuestras-mesas';
    else if (id === 'oficina') targetId = 'nuestras-oficinas';

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }
</script>

<section id="espacios" data-screen-label="Espacios y tarifas">
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <div class="eyebrow">02 · Espacios y tarifas</div>
          <h2 class="serif">Dos formas de instalarte.</h2>
        </div>
      </div>
    </Reveal>

    <div class="spaces-grid">
      {#each spaces as s, i}
        <Reveal delay={i + 1}>
          <SpaceCard space={s} onOpenGallery={handleOpenGallery} onCta={handleCta} />
        </Reveal>
      {/each}
    </div>

    <AvailabilityBoard
      boardId="nuestras-mesas"
      eyebrow="Mesas · Individuales"
      title="Nuestras mesas"
      desc=""
      items={desks}
      unitWord="mesa"
      priceLabel="160 € + IVA"
    />

    <AvailabilityBoard
      boardId="nuestras-oficinas"
      eyebrow="Oficinas · Privadas"
      title="Nuestras oficinas"
      desc=""
      items={offices}
      unitWord="oficina"
      photoPrefix="oficina"
      {officePhotos}
    />

    <ZonasComunes commonsPhotos={commonsPhotos} onOpenGallery={handleOpenGallery} />
  </div>

  {#if spacesGallery !== null}
    <SpacesGallery {gallery} focusKey={spacesGallery} onClose={() => spacesGallery = null} />
  {/if}
</section>
