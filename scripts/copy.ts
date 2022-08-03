import fs from 'fs-extra';
import path from 'path';

/**
 * dist に必要なリソースを複製するスクリプト。
 * copy-webpack-plugin でしていたが、npm-run-all で並列にいけるところは
 * webpack外で済ませてしまおうと考えた結果のコレ。
 */
(() => {
	const root_path = path.resolve(process.argv[1] || '', '..', '..');
	const dist_path = path.resolve(root_path, 'dist');

	{
		const from = path.resolve(root_path, 'img');
		const to = path.resolve(dist_path, 'img');
		fs.copySync(from, to, { recursive: true });
	}

	console.log(`${__filename}: COMPLETED!!`);
})();
