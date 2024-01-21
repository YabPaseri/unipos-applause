import { Logger } from './common/Logger';

// Asynch function are not allowed.
(function main() {
	const logger = Logger.getLogger('BACKGROUND');
	logger.info(`${import.meta.env.VITE_APP_TITLE} has been loaded.`);
})();
