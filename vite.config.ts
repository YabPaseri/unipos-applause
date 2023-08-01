import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { author, description, version as version_name } from './package.json';
import archive from './plugin/vite-plugin-archive';

const version = version_name.replace(/[^\d.-]+/g, '').replace('-', '.');
const manifest = defineManifest(({ mode }) => ({
	manifest_version: 3,
	name: 'Advanced Unipos',
	author,
	version,
	version_name: version_name + (mode === 'production') ? '' : ` (${mode})`,
	description,
	icons: {
		'16': 'icons/icon16.png',
		'32': 'icons/icon32.png',
		'48': 'icons/icon48.png',
		'128': 'icons/icon128.png',
	},
	content_scripts: [
		{
			matches: ['https://unipos.me/*'],
			js: ['src/content-script.ts'],
		},
	],
	background: {
		service_worker: 'src/service-worker.ts',
		type: 'module',
	},
	permissions: ['storage', 'alarms', 'notifications'],
	web_accessible_resources: [{ resources: ['icons/icon128.png'], matches: ['<all_urls>'] }],
}));

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), crx({ manifest }), archive()],
	build: {
		minify: false,
	},
});
