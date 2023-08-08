import { parse as parseDateFns } from 'date-fns';
import { Logger } from '../logger';
import { Preferences } from '../preferences';
import { BackgroundBase } from './background-base';
import { NotificationListener } from './notification-listener';

export class AlarmListener implements BackgroundBase {
	setup(): void {
		chrome.alarms.onAlarm.addListener(async (alarm) => {
			await Preferences.reload();
			Logger.debug('AlarmListener specified time has arrived:', JSON.stringify(alarm));
			if (alarm.name === import.meta.env.VITE_APP_TITLE) {
				// 待つ必要は無い。
				NotificationListener.notify();
			}
		});
	}

	public static async update(): Promise<Date | null> {
		await Preferences.reload();
		Logger.debug('AlarmListener update alarm:', Preferences.str());
		// とりあえず消す。必要なら作る。
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
			Logger.info(`AlarmListener updated alarm. The first time is ${d.toLocaleString()}`);
			return d;
		}
		Logger.info('AlarmListener removed alarm.');
		return null;
	}
}
