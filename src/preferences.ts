import { z } from 'zod';
import { Logger, LogLevel } from './logger';
import Util from './util';

export type PreferencesListener = (before: Readonly<Preference>, after: Readonly<Preference>) => void;

/**
 * 設定
 */
export class Preferences {
	static #data: Preference;
	static #listeners: PreferencesListener[] = [];

	public static readonly init = async () => {
		if (this.#data) return;
		this.#data = new Preference(await chrome.storage.local.get(null));
		await this.save();
	};
	public static readonly save = async () => {
		await chrome.storage.local.clear();
		await chrome.storage.local.set(this.#data.toJSON());
	};
	public static readonly str = () => {
		return JSON.stringify(this.#data);
	};

	public static readonly addListener = (l: PreferencesListener) => {
		if (!this.#listeners.includes(l)) this.#listeners.push(l);
	};
	public static readonly removeListener = (l: PreferencesListener) => {
		this.#listeners = this.#listeners.filter((ll) => ll !== l);
	};
	private static notify(fy: (p: Preference) => void) {
		const before = new Preference(this.#data.toJSON());
		fy(this.#data);
		for (const l of this.#listeners) l(before, this.#data);
	}

	/**
	 * ログレベル
	 */
	public static get log_level(): LogLevel {
		return this.#data.log_level;
	}
	public static set log_level(v: LogLevel) {
		if (this.#data.log_level !== v) this.notify((p) => (p.log_level = v));
	}
	/**
	 * 監視・操作対象のDOM要素を探す間隔(ms)
	 */
	public static get try_interval(): number {
		return this.#data.try_interval;
	}
	public static set try_interval(v: number) {
		if (this.#data.try_interval !== v) this.notify((p) => (p.try_interval = v));
	}
	/**
	 * 監視・操作対象のDOM要素を探す上限回数
	 */
	public static get try_limit(): number {
		return this.#data.try_limit;
	}
	public static set try_limit(v: number) {
		if (this.#data.try_limit !== v) this.notify((p) => (p.try_limit = v));
	}
	/**
	 * 拍手の送り忘れアラームの有効フラグ
	 */
	public static get alarm_active(): boolean {
		return this.#data.alarm_active;
	}
	public static set alarm_active(v: boolean) {
		if (this.#data.alarm_active !== v) this.notify((p) => (p.alarm_active = v));
	}
	/**
	 * 拍手の送り忘れアラームを表示する曜日
	 */
	public static get alarm_wday(): number {
		return this.#data.alarm_wday;
	}
	public static set alarm_wday(v: number) {
		if (this.#data.alarm_wday !== v) this.notify((p) => (p.alarm_wday = v));
	}
	/**
	 * 拍手の送り忘れアラームを表示する時刻
	 */
	public static get alarm_time(): string {
		return this.#data.alarm_time;
	}
	public static set alarm_time(v: string) {
		if (this.#data.alarm_time !== v) this.notify((p) => (p.alarm_time = v));
	}
}

class Preference {
	#log_level!: LogLevel;
	#try_interval!: number;
	#try_limit!: number;
	#alarm_active!: boolean;
	#alarm_wday!: number;
	#alarm_time!: string;

	constructor(json: { [K in keyof Preference]+?: Preference[K] }) {
		const d = <K extends keyof this, V extends this[K]>(key: K, val: V | undefined, def: V) => {
			try {
				this[key] = val || def;
			} catch {
				this[key] = def;
			}
		};
		d('log_level', json.log_level, 'INFO');
		d('try_interval', json.try_interval, 250);
		d('try_limit', json.try_limit, 40);
		d('alarm_active', json.alarm_active, false);
		d('alarm_wday', json.alarm_wday, 5); // FRI
		d('alarm_time', json.alarm_time, '1700'); // 17:00
	}

	public get toJSON() {
		return () => ({
			log_level: this.#log_level,
			try_interval: this.#try_interval,
			try_limit: this.#try_limit,
			alarm_active: this.#alarm_active,
			alarm_wday: this.#alarm_wday,
			alarm_time: this.#alarm_time,
		});
	}

	/**
	 * ログレベル
	 */
	public get log_level(): LogLevel {
		return this.#log_level;
	}
	public set log_level(v: LogLevel) {
		const _v = z.enum(Logger.levels).parse(v);
		this.#log_level = _v;
	}

	/**
	 * 監視・操作対象のDOM要素を探す間隔(ms)
	 */
	public get try_interval(): number {
		return this.#try_interval;
	}
	public set try_interval(v: number) {
		const _v = z.number().int().min(1).parse(v);
		this.#try_interval = _v;
	}

	/**
	 * 監視・操作対象のDOM要素を探す上限回数
	 */
	public get try_limit(): number {
		return this.#try_limit;
	}
	public set try_limit(v: number) {
		const _v = z.number().int().min(1).parse(v);
		this.#try_limit = _v;
	}

	/**
	 * 拍手の送り忘れアラームの有効フラグ
	 */
	public get alarm_active(): boolean {
		return this.#alarm_active;
	}
	public set alarm_active(v: boolean) {
		const _v = z.boolean().parse(v);
		this.#alarm_active = _v;
	}

	/**
	 * 拍手の送り忘れアラームを表示する曜日
	 */
	public get alarm_wday(): number {
		return this.#alarm_wday;
	}
	public set alarm_wday(v: number) {
		const _v = z.number().int().min(0).max(6).parse(v);
		this.#alarm_wday = _v;
	}

	/**
	 * 拍手の送り忘れアラームを表示する時刻
	 */
	public get alarm_time(): string {
		return this.#alarm_time;
	}
	public set alarm_time(v: string) {
		if (Util.isTime(v, true)) this.#alarm_time = v;
	}
}
