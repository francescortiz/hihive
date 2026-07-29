<script lang="ts">
  import type { Site } from '$lib/server/db';
  import Reveal from './Reveal.svelte';
  import ArrowIcon from './ArrowIcon.svelte';

  let {
    site,
    onOpenGallery
  }: {
    site: Site;
    onOpenGallery: () => void;
  } = $props();

  let metaItems: { k: string; l: string }[] = $derived(
    (() => {
      try { return JSON.parse(site.hero_meta_json) as { k: string; l: string }[]; }
      catch { return []; }
    })()
  );
</script>

<section class="hero" id="top" data-screen-label="Hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <Reveal class="eyebrow">{site.hero_eyebrow}</Reveal>
        <Reveal delay={1}>
          <h1
            class="serif"
            style="color: {site.hero_title_color}; font-size: {site.hero_title_font_size}; font-style: {site.hero_title_italic ? 'italic' : 'normal'}"
          >
            {site.hero_title}
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p class="hero-sub" style="font-style: {site.hero_sub_italic ? 'italic' : 'normal'}">
            {site.hero_sub}
          </p>
        </Reveal>
        <Reveal delay={3} class="hero-actions">
          <a class="btn lg accent" href="#reserva">
            Reserva tu lugar <ArrowIcon />
          </a>
          <button type="button" class="btn lg ghost" onclick={onOpenGallery}>Galería</button>
        </Reveal>
      </div>
      <Reveal delay={2}>
        <div class="hero-visual">
          <img class="hero-photo" src={site.hero_photo} alt="Vista del coworking HiHive" />
        </div>
      </Reveal>
    </div>
    <Reveal delay={3}>
      <div class="hero-meta">
        {#each metaItems as item}
          <div class="item">
            <div class="k serif">{item.k}</div>
            <div class="l">{@html item.l}</div>
          </div>
        {/each}
      </div>
    </Reveal>
  </div>
</section>
