import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';

export default defineConfig({
	plugins: [
		sveltekit(),
		cjsInterop({
			dependencies: ['@googlemaps/js-api-loader']
		})
	],

	server: {
		cors: {
			origin: false
		}
	}
});
