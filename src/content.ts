import { View } from '$view/unipos/View';
import { Logger } from './common/Logger';
import { UniposAPI } from './unipos';

(async function main() {
	const logger = Logger.getLogger('CONTENT');
	logger.info(`${import.meta.env.VITE_APP_TITLE} has been loaded.`);
	logger.debug(`This extension was built in ${import.meta.env.MODE} mode.`);

	if (!UniposAPI.ready) {
		logger.fatal('Extensions are not available on this page.');
		return;
	}

	setTimeout(() => View.on(), 500);
})();
