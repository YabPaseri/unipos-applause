import { Logger } from '../logger';
import { Preferences } from '../preferences';
import { BackgroundBase } from './background-base';

export class NotificationListener implements BackgroundBase {
	setup(): void {
		chrome.notifications.onClicked.addListener(async (id) => {
			await Preferences.reload();
			Logger.debug('NotificationListener clicked message:', id);
			if (id === import.meta.env.VITE_APP_TITLE) {
				chrome.tabs.create({ active: true, url: 'https://unipos.me/all' });
			}
		});
	}

	public static async notify() {
		chrome.notifications.create(import.meta.env.VITE_APP_TITLE, {
			title: 'Uniposで気持ちは伝えましたか?',
			message: 'セットした日時になりました。\n通知をクリックして\nUniposを覗いてみませんか?',
			type: 'basic',
			iconUrl: chrome.runtime.getURL('icons/icon128.png'),
		});
	}
}
