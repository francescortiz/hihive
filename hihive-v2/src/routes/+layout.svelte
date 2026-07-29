<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	let { children, data } = $props();

	// Paletas del prototipo (app.jsx lines 728-746).
	const PALETTES: Record<string, Record<string, string>> = {
		terracotta: { '--bg': '#f5f0ea', '--bg-elev': '#faf6f0', '--ink': '#2a2520', '--ink-soft': '#5b5249', '--line': '#e5dccf', '--sand': '#e8ddd0', '--accent': '#b86b4a', '--accent-deep': '#8f4f33', '--accent-soft': '#f0d9cb' },
		sage: { '--bg': '#f5f5f0', '--bg-elev': '#fafaf4', '--ink': '#1f2620', '--ink-soft': '#4f5a4d', '--line': '#dbe0d4', '--sand': '#dbe0d4', '--accent': '#6e8a64', '--accent-deep': '#4d6647', '--accent-soft': '#d1dccb' },
		midnight: { '--bg': '#0e1116', '--bg-elev': '#161b22', '--ink': '#f0eee8', '--ink-soft': '#9aa0a8', '--line': '#252b34', '--sand': '#1b2029', '--accent': '#d4a878', '--accent-deep': '#b78a5a', '--accent-soft': '#3a2e22' },
		paper: { '--bg': '#ffffff', '--bg-elev': '#f7f7f5', '--ink': '#0a0a0a', '--ink-soft': '#5a5a58', '--line': '#e5e5e1', '--sand': '#ececea', '--accent': '#3a5a9f', '--accent-deep': '#23437a', '--accent-soft': '#d6dff0' }
	};

	$effect(() => {
		const palette = PALETTES[data.site?.palette ?? 'terracotta'] ?? PALETTES.terracotta;
		const root = document.documentElement.style;
		for (const [k, v] of Object.entries(palette)) {
			root.setProperty(k, v);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />

	<link rel="icon" href="/HiHive Coworking.png" sizes="any">
	<link rel="icon" href="/HiHive Coworking.png" type="image/svg+xml">
	<link rel="apple-touch-icon" href="/HiHive Coworking.png">
</svelte:head>

{@render children()}
