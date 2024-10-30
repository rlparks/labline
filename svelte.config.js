import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		csp: {
			directives: {
				"script-src": ["self", "https://analytics.esd.uga.edu/script.js"],
				"object-src": ["none"],
				"style-src": ["self", "unsafe-inline"],
				"default-src": ["none"],
				"base-uri": ["none"],
				"form-action": ["self"],
				"frame-ancestors": ["none"],
				"font-src": ["self", "https://cdn.jsdelivr.net"], // beercss?
				"img-src": ["self", "data:"],
				"connect-src": ["self", "https://analytics.esd.uga.edu"],
				"upgrade-insecure-requests": true,
			},
		},
	},
};

export default {
	...config,
	compilerOptions: {
		runes: true,
	},
};
