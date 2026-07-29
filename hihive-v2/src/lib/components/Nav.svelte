<script lang="ts">
  import type { Site } from '$lib/server/db';
  import ArrowIcon from './ArrowIcon.svelte';

  let { site }: { site: Site } = $props();
  let scrolled = $state(false);

  $effect(() => {
    const onScroll = () => { scrolled = window.scrollY > 8; };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<header class="nav{scrolled ? ' scrolled' : ''}" data-screen-label="Nav">
  <div class="container nav-inner">
    <a href="#top" class="brand" aria-label="HiHive — inicio">
      <span class="brand-name">{site.brand_name}<em>{site.brand_em}</em> Coworking</span>
    </a>
    <nav class="nav-links" aria-label="Principal">
      <a href="#top">Inicio</a>
      <a href="#espacios">Espacios</a>
      <a href="#reserva">Reserva</a>
      <a href="#contacto">Contacto</a>
    </nav>
    <a class="btn nav-cta" href="#reserva">
      Contacta con nosotros
      <ArrowIcon />
    </a>
  </div>
</header>
