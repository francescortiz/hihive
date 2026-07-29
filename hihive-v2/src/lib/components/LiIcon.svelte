<script lang="ts">
  let { class: className = '', ...rest }: { class?: string; [key: string]: any } = $props();
</script>

<svg class={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...rest}>
  <path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10z" />
</svg>
