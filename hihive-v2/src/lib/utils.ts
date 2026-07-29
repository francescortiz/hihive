// Re-export del asset() nativo de SvelteKit ($app/paths).
// Sustituye al helper custom — usa la API oficial no deprecated.
// Durante SSR genera paths relativos automáticamente.
export { asset } from '$app/paths';