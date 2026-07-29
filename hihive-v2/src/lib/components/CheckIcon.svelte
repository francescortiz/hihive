<script lang="ts">
  let { class: className = '', ...rest }: { class?: string; [key: string]: any } = $props();
</script>

<svg class={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" {...rest}>
  <path d="M20 6L9 17l-5-5" />
</svg>
