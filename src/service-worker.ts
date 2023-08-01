import { parse as parseDateFns } from 'date-fns';
import { Logger } from './logger';
import { SContent } from './message';
import { Preferences } from './preferences';

(async function main() {
	// 定期実行を行うために、アラーム（スケジューラ）を使用する。
	// content_script側で設定を切り替えるが、アラームへの登録は background(service-worker)しか行えないので、
	// メッセージ経由で行うこととする（content_scriptから依頼だけ飛ばしてもらう）
	await Preferences.init();

	// メッセージのリスナを登録
	chrome.runtime.onMessage.addListener(async (message: SContent, _, sendResponse) => {
		Logger.debug('background received message:', JSON.stringify(message));
		switch (message.summary) {
			case 'update-alarm': {
				// なぜか、content側でmessageが取れないんだよな...
				sendResponse(JSON.stringify({ from: 'service', summary: 'update-alarm', result: await updateAlarm() }));
				break;
			}
			default:
				break;
		}
	});

	// アラームのリスナを登録
	chrome.alarms.onAlarm.addListener((alarm) => {
		// スケジュールされた時刻で、デスクトップ通知を飛ばす。
		if (alarm.name === import.meta.env.VITE_APP_TITLE) {
			chrome.notifications.create(import.meta.env.VITE_APP_TITLE, {
				title: 'Uniposの拍手はお忘れではありませんか?',
				message: 'セットした日時になりました。\nUniposを覗いてみましょう',
				type: 'basic',
				iconUrl: chrome.runtime.getURL('icons/icon128.png'),
				eventTime: Date.now(),
				priority: 2,
				silent: false,
			});
		}
	});

	// 通知クリック時のリスナを登録。
	chrome.notifications.onClicked.addListener(async (id) => {
		if (id === import.meta.env.VITE_APP_TITLE) {
			// クリック時にはUniposのURLに飛ぶようにしておく。固有URLではないので固定でOK
			chrome.tabs.create({ active: true, url: 'https://unipos.me/all' });
		}
	});
})();

/**
 * chromeのストレージに格納されている設定をもとに、アラーム（スケジューラ）の更新を行う
 */
async function updateAlarm() {
	Logger.debug('#update Alarm...');
	await Preferences.reload(); // initだと、既に持っているインスタンスばかり参照して、最新の情報が取れない？
	// 全消し→必要なら作る
	await chrome.alarms.clearAll();
	if (Preferences.alarm_active) {
		// 今より未来を作るので、現在の日時でDateを作り、時刻だけアラームの日付に変える。
		// その上で、曜日が期待する曜日になるまで、+1日していく。
		// その際、getTime() の値が、現在のgetTime() より過去の場合はスルーする。
		// 現在が水曜の10時で、アラームを水曜の9時にセットされた場合などの対処。
		const d = parseDateFns(Preferences.alarm_time, 'HHmm', new Date());
		d.setSeconds(0, 0); // date-fnsの機能で、時分以外は new Date() の値で補われている。秒以下調整
		const w = Preferences.alarm_wday;
		for (; d.getDay() !== w || d.getTime() < Date.now(); d.setDate(d.getDate() + 1)) {} // eslint-disable-line no-empty
		chrome.alarms.create(import.meta.env.VITE_APP_TITLE, {
			when: d.getTime(),
			periodInMinutes: 10080, // 7*24*60 = 1週間
		});
		Logger.info(`update alarm. first is ${JSON.stringify(d)}`);
		return d;
	}
	Logger.debug(`removed alarm`);
	return null;
}
