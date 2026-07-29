<script lang="ts">
  let { class: className = '', ...rest }: { class?: string; [key: string]: any } = $props();
</script>

<svg class={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...rest}>
  <path d="M18.244 2H21l-6.52 7.46L22 22h-6.84l-4.78-6.26L4.8 22H2l6.97-7.97L2 2h6.96l4.32 5.71L18.24 2zm-1.2 18h1.86L7.05 4H5.08l11.96 16z" />
</svg>
