import fs from 'fs-extra';
import path from 'path';
import pkg from '../package.json';

/**
 * manifest.json をdistに生成するスクリプト。
 * 補完が効くので、ts で生成している。
 */
(() => {
	const manifest: chrome.runtime.ManifestV3 = {
		manifest_version: 3,
		name: 'Unipos Applause',
		version: pkg.version,

		// default_locale: 'ja',
		description: pkg.description,
		icons: {
			'16': './img/icon16.png',
			'32': './img/icon32.png',
			'48': './img/icon48.png',
			'128': './img/icon128.png',
		},

		author: pkg.author,
		content_scripts: [
			{
				matches: ['https://unipos.me/*'],
				js: ['content-script.js'],
				css: ['content-script.css'],
			},
		],

		permissions: ['storage'],
		// web_accessible_resources: [{ matches: ['https://unipos.me/*'], resources: [] }],
	};

	const json_path = path.resolve(process.argv[1] || '', '..', '..', 'dist', 'manifest.json');
	fs.mkdirSync(path.dirname(json_path), { recursive: true });
	fs.writeFileSync(json_path, JSON.stringify(manifest, void 0, '\t'), { encoding: 'utf-8' });

	console.log(`${__filename}: COMPLETED!!`);
})();
