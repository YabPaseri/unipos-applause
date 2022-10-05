import fs from 'fs-extra';
import path from 'path';
import { normalizePath, Plugin, ResolvedConfig } from 'vite';
import { author, description, ext_version, version as version_name } from '../package.json';

export default function manifest(): Plugin {
	let config: ResolvedConfig;
	return {
		name: 'chrome-manifest',
		configResolved: (c) => {
			config = c;
		},
		buildStart: () => {
			const version = ext_version ? ext_version : version_name.replace(/[^\d.-]+/g, '').replace('-', '.');
			const manifest: chrome.runtime.ManifestV3 = {
				manifest_version: 3,
				name: 'Advanced Unipos',
				version,
				version_name,
				description,
				icons: {
					'16': './icons/icon16.png',
					'32': './icons/icon32.png',
					'48': './icons/icon48.png',
					'128': './icons/icon128.png',
				},
				author,
				content_scripts: [
					{
						matches: ['https://unipos.me/*'],
						js: ['content-script.js'],
						// css: ['style.css'],
					},
				],
				permissions: ['storage'],
			};
			const outDir = normalizePath(config.publicDir);
			const outPath = path.resolve(outDir, 'manifest.json');
			fs.writeFileSync(outPath, JSON.stringify(manifest, void 0, '\t'), { encoding: 'utf-8' });
			console.log('[vite-plugin-chrome-manifest] exported manifest.json');
		},
	};
}
