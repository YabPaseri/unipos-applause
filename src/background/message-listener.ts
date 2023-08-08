import { Logger } from '../logger';
import { Preferences } from '../preferences';
import { AlarmListener } from './alarm-listener';
import { BackgroundBase } from './background-base';

export class MessageListener implements BackgroundBase {
	setup(): void {
		chrome.runtime.onMessage.addListener((message: SContent, _, sendResponse: (response: RContent | null) => void) => {
			// なかなかsendResponseしても値をcontent-scriptに返せず悩んでいたが、
			// ある時「true」を返却することで非同期として扱われるという記事を見つけた。
			// が、それもなかなか上手くいかず。
			// 結論としては、addListenerのコールバックをasyncにしていて、処理を行った後に true を返していたから。
			// content-scriptには早々に非同期であることを教える必要があるので、
			// addListenerのコールバックは同期でないとダメ。と、いうことでこんな書き方。
			(async () => {
				await Preferences.reload();
				Logger.debug('MessageListener received message:', JSON.stringify(message));
				switch (message.summary) {
					case 'update-alarm': {
						const result = await AlarmListener.update();
						sendResponse({ summary: 'update-alarm', result: JSON.stringify(result) });
						break;
					}
					default:
						sendResponse(null);
						break;
				}
			})();
			return true;
		});
	}

	public static async send(content: SContent): Promise<RContent> {
		const r = await chrome.runtime.sendMessage<SContent, RContent | null>(content);
		if (r == null) {
			throw new Error('unknown content summary');
		}
		return r;
	}
}

export type SContent = { summary: 'update-alarm' };
export type RContent = { summary: 'update-alarm'; result: string };
