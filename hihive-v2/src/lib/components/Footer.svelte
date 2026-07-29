<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Site } from '$lib/server/db';

  let { site }: { site: Site } = $props();
</script>

<footer>
  <div class="container foot-grid">
    <div class="col-brand">
      <div class="foot-brand-name">
        {site.brand_name}<em>{site.brand_em}</em> Coworking
      </div>
      <p class="foot-tag">{site.footer_tag}</p>
    </div>
    <div class="foot-col">
      <h4>Espacios</h4>
      <a href="#espacios">Mesas</a>
      <a href="#espacios">Oficina privada</a>
    </div>
    <div class="foot-col">
      <h4>Información</h4>
      <a href="#contacto">Contacto</a>
    </div>
    <div class="foot-col">
      <h4>Legal</h4>
      <a href={resolve('/aviso-legal')}>Aviso legal</a>
      <a href={resolve('/privacidad')}>Privacidad</a>
      <a href={resolve('/cookies')}>Cookies</a>
    </div>
  </div>
  <div class="container foot-bot">
    <span>© {site.footer_year} {site.brand_name} · Hecho en Barcelona</span>
    <span class="mono">{site.footer_version}</span>
  </div>
</footer>
