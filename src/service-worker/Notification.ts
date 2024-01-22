import { Logger } from '$common/Logger';
import { ServiceWorkerBase } from './ServiceWorkerBase';

export class Notification extends ServiceWorkerBase {
	private logger: Logger = Logger.getLogger('BACKGROUND');

	setup(): this {
		chrome.notifications.onClicked.addListener(() => {
			this.logger.info('Clicked notification');
			chrome.tabs.create({ active: true, url: 'https://unipos.me/all' });
		});
		chrome.notifications.onButtonClicked.addListener(async () => {
			this.logger.info("Clicked notification's button");
			await this.connection.alarm.snooze();
		});
		return this;
	}

	async notify() {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: chrome.runtime.getURL('icons/icon128.png'),
			title: 'Uniposで気持ちは伝えましたか?',
			message: '指定された日時になりました。\n通知をクリックして\nUniposをのぞいてみませんか?',
			buttons: [{ title: 'あとで通知する' }],
		});
		this.logger.info('Created notification.');
	}
}
