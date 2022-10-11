import { Logger } from './logger';
import { Preferences } from './preferences';
import UniposAPI from './unipos';
import { View } from './view';

(async function main() {
	await Preferences.init();
	Logger.info(`WebExtension "${import.meta.env.VITE_APP_TITLE}" has been loaded`);
	Logger.debug(`This extension was built in ${import.meta.env.MODE} mode.`);
	Logger.debug(`Preferences: ${Preferences.str()}`);

	if (!UniposAPI.ready) {
		Logger.warn('Extensions are not available on this page.');
		return;
	}

	setTimeout(View.on, 500);
})();
