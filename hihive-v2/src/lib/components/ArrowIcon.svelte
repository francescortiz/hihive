<script lang="ts">
  let { class: className = '', ...rest }: { class?: string; [key: string]: any } = $props();
</script>

<svg class={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...rest}>
  <path d="M5 12h14M13 5l7 7-7 7" />
</svg>
