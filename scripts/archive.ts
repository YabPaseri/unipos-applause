import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';
import { constants as z_constants } from 'zlib';
import pkg from '../package.json';

(() => {
	const root_path = path.resolve(process.argv[1] || '', '..', '..');

	const filename = `${pkg.name}_${pkg.version}.zip`;
	const filepath = path.resolve(root_path, 'archive', filename);

	const archive = archiver.create('zip', { zlib: { level: z_constants.Z_BEST_COMPRESSION } });
	const output = archive.pipe(fs.createWriteStream(filepath));

	output.on('close', () => {
		console.log(`${__filename}: COMPLETED!!  {totalsize: '${archive.pointer()} bytes}'`);
	});

	const dist_path = path.resolve(root_path, 'dist');
	archive.directory(dist_path, false).finalize();
})();
