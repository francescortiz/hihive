<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import ArrowIcon from '$lib/components/ArrowIcon.svelte';
  import WhatsappIcon from '$lib/components/WhatsappIcon.svelte';
  import TelegramIcon from '$lib/components/TelegramIcon.svelte';
  import type { Site } from '$lib/server/db';

  let { site }: { site: Site } = $props();

  let waUrl = $derived(`https://wa.me/${site.phone_intl}?text=${encodeURIComponent(site.wa_message)}`);
  let tgUrl = $derived(`https://t.me/+${site.phone_intl}`);
</script>

<section id="reserva" class="reserva" data-screen-label="Reserva online">
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <div class="eyebrow">03 · Reserva</div>
          <h2 class="serif">Contacta con nosotros</h2>
        </div>
      </div>
    </Reveal>
    <div class="reserva-grid">
      <Reveal class="reserva-left">
        <p>{site.reserva_intro}</p>
      </Reveal>
      <Reveal delay={2}>
        <div class="channels-card">
          <div class="channels-head">
            <span class="eyebrow">Escríbenos</span>
            <h3 class="channels-phone serif">Reserva en un mensaje</h3>
            <p class="channels-note"></p>
          </div>
          <div class="channels-list">
            <a
              class="channel channel--wa"
              href={waUrl}
              target="_blank"
              rel="noopener"
            >
              <span class="channel-ico"><WhatsappIcon /></span>
              <span class="channel-body">
                <span class="channel-name">WhatsApp</span>
                <span class="channel-sub">Chatea con nosotros ahora mismo</span>
              </span>
              <span class="arrow"><ArrowIcon /></span>
            </a>
            <a
              class="channel channel--tg"
              href={tgUrl}
              target="_blank"
              rel="noopener"
            >
              <span class="channel-ico"><TelegramIcon /></span>
              <span class="channel-body">
                <span class="channel-name">Telegram</span>
                <span class="channel-sub">Escríbenos por Telegram</span>
              </span>
              <span class="arrow"><ArrowIcon /></span>
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>
