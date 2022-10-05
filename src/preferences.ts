import { Logger, LogLevel } from './logger';

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
	 * サイドメニューにバックドロップを追加する
	 */
	public static get sidemenu_backdrop(): boolean {
		return this.#data.sidemenu_backdrop;
	}
	public static set sidemenu_backdrop(v: boolean) {
		if (this.#data.sidemenu_backdrop !== v) this.notify((p) => (p.sidemenu_backdrop = v));
	}
	/**
	 * Consumer(一括拍手)を移動可能なウィンドウで表示する
	 */
	public static get consumer_window(): boolean {
		return this.#data.consumer_window;
	}
	public static set consumer_window(v: boolean) {
		if (this.#data.consumer_window !== v) this.notify((p) => (p.consumer_window = v));
	}
}

class Preference {
	#log_level!: LogLevel;
	#try_interval!: number;
	#try_limit!: number;
	#sidemenu_backdrop!: boolean;
	#consumer_window!: boolean;

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
		d('sidemenu_backdrop', json.sidemenu_backdrop, false);
		d('consumer_window', json.consumer_window, false);
	}

	public get toJSON() {
		return () => ({
			log_level: this.#log_level,
			try_interval: this.#try_interval,
			try_limit: this.#try_limit,
			sidemenu_backdrop: this.#sidemenu_backdrop,
			consumer_window: this.#consumer_window,
		});
	}

	/**
	 * ログレベル
	 */
	public get log_level(): LogLevel {
		return this.#log_level;
	}
	public set log_level(v: LogLevel) {
		if (typeof v !== 'string' || !Logger.level.is(v)) {
			throw new TypeError(`Preference.log_level accepts only ${Logger.level.summary}: ${v}`);
		}
		this.#log_level = v;
	}

	/**
	 * 監視・操作対象のDOM要素を探す間隔(ms)
	 */
	public get try_interval(): number {
		return this.#try_interval;
	}
	public set try_interval(v: number) {
		const e = `Preference.try_interval accepts only positive integers: ${v}`;
		if (!Number.isSafeInteger(v)) {
			throw new TypeError(e);
		} else if (v < 1) {
			throw new RangeError(e);
		}
		this.#try_interval = v;
	}

	/**
	 * 監視・操作対象のDOM要素を探す上限回数
	 */
	public get try_limit(): number {
		return this.#try_limit;
	}
	public set try_limit(v: number) {
		const e = `Preference.try_limit accepts only positive integers: ${v}`;
		if (!Number.isSafeInteger(v)) {
			throw new TypeError(e);
		} else if (v < 1) {
			throw new RangeError(e);
		}
		this.#try_limit = v;
	}

	/**
	 * サイドメニューにバックドロップを追加する
	 */
	public get sidemenu_backdrop(): boolean {
		return this.#sidemenu_backdrop;
	}
	public set sidemenu_backdrop(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError(`Preference.sidemenu_backdrop accepts only boolean: ${v}`);
		}
		this.#sidemenu_backdrop = v;
	}

	/**
	 * Consumer(一括拍手)を移動可能なウィンドウで表示する
	 */
	public get consumer_window(): boolean {
		return this.#consumer_window;
	}
	public set consumer_window(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError(`Preference.consumer_window accepts only boolean: ${v}`);
		}
		this.#consumer_window = v;
	}
}
