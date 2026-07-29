import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Directorio de output. Por defecto 'dist'.
// Override con: BUILD_DIR=preview bun run build
const OUT = process.env.BUILD_DIR ?? 'dist';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				// Output estático que mapea el reverse proxy.
				// Sin fallback: las páginas prerendered se sirven como HTML completo.
				pages: OUT,
				assets: OUT,
				precompress: false,
				strict: true
			})
		})
	]
});