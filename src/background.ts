import { Logger } from './common/Logger';
import { Connection } from './service-worker';

declare const globalThis: WorkerGlobalScope & {
	connection: Connection;
};

// Asynch function are not allowed.
(function main() {
	const logger = Logger.getLogger('BACKGROUND');
	logger.info(`${import.meta.env.VITE_APP_TITLE} has been loaded.`);

	const conn = Connection.create();
	logger.info('Created connection.');
	globalThis.connection = conn;
})();
