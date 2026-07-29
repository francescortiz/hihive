<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Espacios from '$lib/components/Espacios.svelte';
	import Reserva from '$lib/components/Reserva.svelte';
	import Contacto from '$lib/components/Contacto.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SpacesGallery from '$lib/components/SpacesGallery.svelte';

	let { data } = $props();

	// Estado del modal de galería global (abierto desde Hero o Espacios).
	let galleryOpen = $state(false);

	const openGallery = () => (galleryOpen = true);
	const closeGallery = () => (galleryOpen = false);

	// Fotos de la categoría "comunes" para ZonasComunes (dentro de Espacios).
	const commonsPhotos = $derived(
		data.gallery.find((g) => g.category.key === 'comunes')?.photos ?? []
	);
</script>

<svelte:head>
	<title>{data.site.brand_name} · Barcelona</title>
	<meta name="description" content={data.site.hero_sub} />
</svelte:head>

<Nav site={data.site} />

<main>
	<Hero site={data.site} onOpenGallery={openGallery} />

	<Espacios
		spaces={data.spaces}
		desks={data.desks}
		offices={data.offices}
		officePhotos={data.officePhotos}
		gallery={data.gallery}
	/>

	<Reserva site={data.site} />
	<Contacto site={data.site} />
	<Faq items={data.faq} />
</main>

<Footer site={data.site} />

{#if galleryOpen}
	<SpacesGallery gallery={data.gallery} onClose={closeGallery} />
{/if}