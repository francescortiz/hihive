<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import ArrowIcon from '$lib/components/ArrowIcon.svelte';
  import type { Site } from '$lib/server/db';

  let { site }: { site: Site } = $props();

  let mapUrl = $derived(`https://maps.google.com/maps?q=${encodeURIComponent(site.map_query)}&z=17&hl=es&output=embed`);
  let mapsSearchUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.map_query)}`);
</script>

<section id="contacto" data-screen-label="Contacto">
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <div class="eyebrow">04 · Visítanos</div>
          <h2 class="serif">
            {site.address_short}<br />
            {site.address_city}
          </h2>
        </div>
      </div>
    </Reveal>

    <div class="contact-grid">
      <Reveal class="contact-info">
        <dl>
          <div>
            <dt>Dirección</dt>
            <dd>
              {site.address_line1}<br />
              {site.address_line2}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href="mailto:{site.email}">{site.email}</a></dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd><a href="tel:+{site.phone_intl}">+34 {site.phone_display}</a></dd>
          </div>
          <div>
            <dt>Horario de atención al cliente</dt>
            <dd style="font-family: Geist; font-size: 15px; line-height: 1.7;">{site.hours}</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={1}>
        <div class="map-wrap">
          <iframe
            title="Mapa HiHive Coworking"
            src={mapUrl}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div class="map-overlay">
            <div class="t">HiHive Coworking</div>
            <div class="s">
              {site.address_short} · {site.address_city}
            </div>
            <a href={mapsSearchUrl} target="_blank" rel="noopener">
              Cómo llegar <ArrowIcon />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>
