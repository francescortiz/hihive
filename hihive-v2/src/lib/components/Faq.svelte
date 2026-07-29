<script lang="ts">
  import Reveal from '$lib/components/Reveal.svelte';
  import type { FaqItem } from '$lib/server/db';

  let { items }: { items: FaqItem[] } = $props();

  let openId = $state<number | null>(null);

  function toggle(id: number) {
    openId = openId === id ? null : id;
  }
</script>

<section id="condiciones">
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <div class="eyebrow">05 · Condiciones</div>
          <h2 class="serif">Condiciones generales</h2>
        </div>
      </div>
    </Reveal>

    <div class="cond-list">
      {#each items as item}
        <div class="cond-item {openId === item.id ? 'is-open' : ''}">
          <button class="cond-q" onclick={() => toggle(item.id)}>
            <span class="cond-n">{String(item.id).padStart(2, '0')}</span>
            <span class="cond-q-text">{item.question}</span>
            <span class="cond-ico">+</span>
          </button>
          <div class="cond-a">
            <p>{item.answer}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
