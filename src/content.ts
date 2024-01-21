import { Logger } from './common/Logger';

(async function main() {
	const logger = Logger.getLogger('CONTENT');
	logger.info(`${import.meta.env.VITE_APP_TITLE} has been loaded.`);
	logger.debug(`This extension was built in ${import.meta.env.MODE} mode.`);
})();
