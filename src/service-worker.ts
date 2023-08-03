import { parse as parseDateFns } from 'date-fns';
import { Logger } from './logger';
import { SContent } from './message';
import { Preferences } from './preferences';

// async でメイン関数を作り、await Preferences.init(); をしてから各リスナーに対してイベントを追加していたが、
// service-workerの仕様上なのか、メッセージの取得時に落ちる。
// 必要な時にこのjsが実行されて、後続の処理...なので、間に合わないのだろう。
// main関数は非同期にしないことにする。
(function main() {
	// メッセージのリスナーを登録
	chrome.runtime.onMessage.addListener(async (message: SContent, _, sendResponse) => {
		// initは既存のインスタンスを見続けるが、それだと、service-workerが生きている間はフロントで設定した最新値を見られない
		// インスタンスを必ず差し替えるreloadを使うことにする。
		await Preferences.reload();
		Logger.debug('chrome.runtime.onMessage / message:', JSON.stringify(message));
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

	// アラームのリスナーを登録
	chrome.alarms.onAlarm.addListener(async (alarm) => {
		await Preferences.reload();
		Logger.debug('chrome.alarms.onAlarm / alarm:', JSON.stringify(alarm));
		// スケジュールされた時刻で、デスクトップ通知を飛ばす。
		if (alarm.name === import.meta.env.VITE_APP_TITLE) {
			chrome.notifications.create(import.meta.env.VITE_APP_TITLE, {
				title: 'Uniposで気持ちは伝えましたか?',
				message: 'セットした日時になりました。\n通知をクリックして\nUniposを覗いてみませんか?',
				type: 'basic',
				iconUrl: chrome.runtime.getURL('icons/icon128.png'),
			});
		}
	});

	// 通知クリック時のリスナーを登録。
	chrome.notifications.onClicked.addListener(async (id) => {
		await Preferences.reload();
		Logger.debug(`chrome.notifications.onClicked / id: ${id}`);
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
	await Preferences.reload();
	Logger.debug('#updateAlarm, Preferences:', Preferences.str());
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
		Logger.info(`Alarm updated. The first time is ${d.toLocaleString()}`);
		return d;
	}
	Logger.debug(`Alarm removed.`);
	return null;
}
