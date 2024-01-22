import { MessageDto } from '$/data/dto';
import { Logger } from '$common/Logger';
import { Connection } from './Connection';
import { ServiceWorkerBase } from './ServiceWorkerBase';

export class Message extends ServiceWorkerBase {
	private logger: Logger = Logger.getLogger('BACKGROUND');

	constructor(conn: Connection) {
		super(conn);
		this.received = this.received.bind(this);
	}

	setup(): this {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			this.received(message, sender, sendResponse);
			return true;
		});
		return this;
	}

	private async received(message: MessageDto | undefined, sender: chrome.runtime.MessageSender, sendResponse: (res?: MessageDto) => void) {
		this.logger.info('Received message (sender =', sender, '):', message);
		switch (message?.summary) {
			case 'UPDATE_ALARM': {
				await this.connection.alarm.update();
				sendResponse({ summary: 'UPDATED_ALARM' });
				break;
			}
			default:
				sendResponse();
				break;
		}
	}
}
