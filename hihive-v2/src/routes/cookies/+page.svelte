<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<svelte:head>
	<title>Placeholder</title>
</svelte:head>

<div class="container" style="padding-top:120px;padding-bottom:80px;max-width:760px">
	<h1 class="serif" style="font-size:clamp(40px,6vw,72px)">Próximamente</h1>
	<p style="color:var(--ink-soft);font-size:18px">Esta página está en preparación.</p>
	<a href={resolve('/')} style="color:var(--accent)">← Volver al inicio</a>
</div>
