import { AlarmDao, SnoozeDao } from '$/data/dao';
import { Logger } from '$common/Logger';
import { Dates } from '$common/date-utils';
import { ServiceWorkerBase } from './ServiceWorkerBase';

export class Alarm extends ServiceWorkerBase {
	private logger: Logger = Logger.getLogger('BACKGROUND');

	setup(): this {
		chrome.alarms.onAlarm.addListener(async (alarm) => {
			this.logger.info('Time has arrived:', alarm);
			this.connection.notification.notify();
		});
		return this;
	}

	/**
	 * ストレージの設定から、指定時間後のスヌーズ通知を作成する
	 */
	async snooze() {
		const dao = new SnoozeDao(chrome.storage.local);
		const snooze = await dao.get();
		chrome.alarms.create({ delayInMinutes: snooze.interval }); // 単発
		this.logger.info('Created snooze.', snooze);
	}

	/**
	 * ストレージ内の設定から、アラームを再構築する
	 */
	async update() {
		const dao = new AlarmDao(chrome.storage.local);
		const alarms = await dao.get();
		await this.stopPeriodic();
		const updateProcesses = alarms.reduce((processes, alarm) => {
			if (!alarm.active) return processes;
			const d = Dates.parseByFns(alarm.time, 'HHmm', new Date());
			d.setSeconds(0, 0);
			// 今より未来の、指定曜日まで日付を進める。
			while (d.getDay() !== alarm.day || d.getTime() < Date.now()) {
				d.setDate(d.getDate() + 1);
			}
			const process = chrome.alarms.create(alarm.key, {
				when: d.getTime(),
				periodInMinutes: 10080, // = 7日*24時間*60分 = 1週間
			});
			processes.push(process);
			return processes;
		}, new Array<Promise<void>>());
		await Promise.all(updateProcesses);
		this.logger.info('Updated alarms.', alarms);
	}

	/**
	 * 定期実行として登録されているアラームを停止する
	 */
	private async stopPeriodic() {
		// 定期実行になっているアラームを全て取得し停止
		const alarms = (await chrome.alarms.getAll()).filter((a) => a.periodInMinutes != null);
		await Promise.all(alarms.map((a) => chrome.alarms.clear(a.name)));
	}
}
