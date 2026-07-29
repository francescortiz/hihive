<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import UnitPhotos from './UnitPhotos.svelte';

  interface DeskLike {
    id: number;
    taken: number;
    price?: string;
    free_date: string | null;
  }

  interface OfficePhoto {
    office_id: number;
    title: string;
    src: string;
    sort_order: number;
  }

  let {
    boardId,
    eyebrow,
    title,
    desc,
    items,
    unitWord,
    priceLabel = '',
    photoPrefix = '',
    officePhotos = {} as Record<number, OfficePhoto[]>
  }: {
    boardId: string;
    eyebrow: string;
    title: string;
    desc: string;
    items: DeskLike[];
    unitWord: string;
    priceLabel?: string;
    photoPrefix?: string;
    officePhotos?: Record<number, OfficePhoto[]>;
  } = $props();

  let photosFor = $state<number | null>(null);

  function fmtDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
</script>

<Reveal id={boardId} className="desk-board">
  <div class="desk-head">
    <span class="eyebrow">{eyebrow}</span>
    <h3 class="serif">{title}</h3>
    {#if desc}
      <p>{desc}</p>
    {/if}
  </div>

  <div class="desk-row" role="group" aria-label="Mapa de {unitWord}s">
    {#each items as d}
      {@const state = d.taken ? 'taken' : 'free'}
      {@const price = d.price || priceLabel}
      {@const statusText = d.taken ? (d.free_date ? `Libre ${fmtDate(d.free_date)}` : 'Ocupada') : 'Libre'}
      <div class="desk-wrap">
        {#if photoPrefix}
          <button
            type="button"
            class="desk desk--{state}{price ? ' desk--cornernum' : ''} desk--clickable"
            onclick={() => photosFor = d.id}
            aria-label="Ver fotos de {unitWord} {d.id}"
          >
            <span class="desk-num">{d.id}</span>
            {#if price}
              <span class="desk-price">{price}</span>
            {/if}
            <span class="desk-tag"><i class="desk-dot"></i>{statusText}</span>
            <span class="desk-photos-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              Ver fotos
            </span>
          </button>
        {:else}
          <div
            class="desk desk--{state}{price ? ' desk--cornernum' : ''}"
            aria-label="{unitWord} {d.id}{d.taken ? ' (ocupada)' : ''}"
          >
            <span class="desk-num">{d.id}</span>
            {#if price}
              <span class="desk-price">{price}</span>
            {/if}
            <span class="desk-tag"><i class="desk-dot"></i>{statusText}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if photoPrefix && photosFor !== null}
    <UnitPhotos
      photos={officePhotos[photosFor] || []}
      title={unitWord.charAt(0).toUpperCase() + unitWord.slice(1) + ' ' + photosFor}
      eyebrow={title + ' · Fotos'}
      onClose={() => photosFor = null}
    />
  {/if}
</Reveal>
