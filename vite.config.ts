import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { version as _version, author, description } from './package.json';
import archive from './plugins/vite-plugin-archive';

const [major, minor, patch, label = '0'] = _version.replace(/[^\d.-]+/g, '').split(/[.-]/);
const version = `${major}.${minor}.${patch}.${label}`;
const version_name = (mode: string) => (mode === 'production' ? _version : `${_version}(${mode})`);
const manifest = defineManifest(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return {
		manifest_version: 3,
		name: process.env.VITE_APP_TITLE,
		version,
		version_name: version_name(mode),
		author,
		description,
		icons: {
			'16': 'icons/icon16.png',
			'32': 'icons/icon32.png',
			'48': 'icons/icon48.png',
			'128': 'icons/icon128.png',
		},
		options_page: 'pages/options.html',
		action: { default_popup: 'pages/popup.html' },
		background: { service_worker: 'src/background.ts' },
		content_scripts: [
			{
				matches: ['https://*/*', 'http://*/*'],
				js: ['src/modification.ts', 'src/content.ts'],
			},
		],
	};
});

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), crx({ manifest }), archive()],
	build: {
		// chromeの審査に通りやすくするために、ファイル名の固定化や圧縮をさせない
		minify: false,
		rollupOptions: {
			// assetsフォルダ配下の生成物のファイル名からハッシュ値を削除する
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
});
