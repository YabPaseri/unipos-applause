import Util from './util';

/**
 * 拡張機能の設定
 */
export class Options {
	private static e: OptionsEntity;
	private static listeners: OptionsListener[] = [];

	/**
	 * 設定が更新された時に通知を受け取る関数を登録する。
	 */
	public static addListener(l: OptionsListener) {
		if (!this.listeners.includes(l)) {
			this.listeners.push(l);
		}
	}
	public static removeListener(l: OptionsListener) {
		this.listeners = this.listeners.filter((_l) => _l !== l);
	}
	// 現在の設定を複製してから、fyで設定に手を加え、変更前の設定を通知に渡す。
	private static notify(fy: (e: OptionsEntity) => void) {
		const bk = new OptionsEntity(JSON.parse(JSON.stringify(this.e)));
		fy(this.e);
		for (const l of this.listeners) l(bk);
	}

	/**
	 * Optionsの準備。
	 */
	public static async init(): Promise<void> {
		if (this.e) return Promise.resolve(); // 初期化済
		// 値のチェックやデフォルト値への置換は、OptionsEntity側のコンストラクタでしている。
		this.e = new OptionsEntity(await chrome.storage.local.get(null));
	}

	/**
	 * Optionsの値を、拡張機能のストレージに保存する
	 */
	public static async save(): Promise<void> {
		await chrome.storage.local.clear();
		// set の引数の型は `{[key: string]: any}`。
		// 一方で this.e の型は OptionsEntiry でただのクラス。
		// 型チェックで弾かれそうだが、 `{[key: string]: any}` はクラスと互換性があるらしい。
		// JSON.parse(JSON.stringify(this.e)) して渡そうと思ったけど、ま、いいや。
		await chrome.storage.local.set(this.e);
	}

	/**
	 * デバッグログを表示する
	 */
	public static get DEBUG(): boolean {
		return this.e.DEBUG;
	}
	public static set DEBUG(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError('Options.DEBUG accepts only boolean.');
		}
		if (this.e.DEBUG !== v) {
			this.notify((e) => (e.DEBUG = v));
		}
	}

	/**
	 * DOMから要素を探す間隔(ms)
	 */
	public static get TRY_INTERVAL(): number {
		return this.e.TRY_INTERVAL;
	}
	public static set TRY_INTERVAL(v: number) {
		if (!Number.isSafeInteger(v)) {
			throw new TypeError('Options.TRY_INTERVAL accepts only positive integers.');
		}
		if (v < 1) {
			throw new RangeError('Options.TRY_INTERVAL accepts only positive integers.');
		}
		if (this.e.TRY_INTERVAL !== v) {
			// this.e.TRY_INTERVAL = v;
			this.notify((e) => (e.TRY_INTERVAL = v));
		}
	}

	/**
	 * DOMから要素を探す回数(回)
	 */
	public static get TRY_LIMIT(): number {
		return this.e.TRY_LIMIT;
	}
	public static set TRY_LIMIT(v: number) {
		if (!Number.isSafeInteger(v)) {
			throw new TypeError('Options.TRY_LIMIT accepts only positive integers.');
		}
		if (v < 1) {
			throw new RangeError('Options.TRY_LIMIT accepts only positive integers.');
		}
		if (this.e.TRY_LIMIT !== v) {
			// this.e.TRY_LIMIT = v;
			this.notify((e) => (e.TRY_LIMIT = v));
		}
	}

	/**
	 * 拍手の回数を指定する前に、事前に送信可能か否かをチェックしない
	 */
	public static get NO_CHECK(): boolean {
		return this.e.NO_CHECK;
	}
	public static set NO_CHECK(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError('Options.NO_CHECK accepts only boolean.');
		}
		if (this.e.NO_CHECK !== v) {
			// this.e.NO_CHECK = v;
			this.notify((e) => (e.NO_CHECK = v));
		}
	}

	/**
	 * 拍手を 1,3,5 の組み合わせに分割して送信しない
	 */
	public static get NO_SPLIT(): boolean {
		return this.e.NO_SPLIT;
	}
	public static set NO_SPLIT(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError('Options.NO_SPLIT accepts only boolean.');
		}
		if (this.e.NO_SPLIT !== v) {
			// this.e.NO_SPLIT = v;
			this.notify((e) => (e.NO_SPLIT = v));
		}
	}

	/**
	 * サイドメニューにバックドロップを追加する
	 */
	public static get SIDEMENU_BACKDROP(): boolean {
		return this.e.SIDEMENU_BACKDROP;
	}
	public static set SIDEMENU_BACKDROP(v: boolean) {
		if (typeof v !== 'boolean') {
			throw new TypeError('Options.SIDE_OVERLAY accepts only boolean.');
		}
		if (this.e.SIDEMENU_BACKDROP !== v) {
			// this.e.SIDEMENU_OVERLAY = v;
			this.notify((e) => (e.SIDEMENU_BACKDROP = v));
		}
	}
}

/**
 * 設定が変わったときに呼ばれるリスナーの型\
 * 変更前の設定がわたってくるので、Options.xxx の現在の値と比較するなどして使う。
 */
export type OptionsListener = (old: ROptions) => void;
export type ROptions = Readonly<OptionsEntity>;

/**
 * Optionsの値を格納しておく箱
 */
class OptionsEntity {
	public DEBUG: boolean;
	public TRY_INTERVAL: number;
	public TRY_LIMIT: number;
	public NO_CHECK: boolean;
	public NO_SPLIT: boolean;
	public SIDEMENU_BACKDROP: boolean;

	constructor(v: {
		DEBUG?: boolean; //
		TRY_INTERVAL?: number;
		TRY_LIMIT?: number;
		NO_CHECK?: boolean;
		NO_SPLIT?: boolean;
		SIDEMENU_BACKDROP?: boolean;
	}) {
		this.DEBUG = typeof v.DEBUG === 'boolean' && v.DEBUG;
		this.TRY_INTERVAL = Util.isPositiveInt(v.TRY_INTERVAL) ? <number>v.TRY_INTERVAL : 250;
		this.TRY_LIMIT = Util.isPositiveInt(v.TRY_LIMIT) ? <number>v.TRY_LIMIT : 40;
		this.NO_CHECK = typeof v.NO_CHECK === 'boolean' && v.NO_CHECK;
		this.NO_SPLIT = typeof v.NO_SPLIT === 'boolean' && v.NO_SPLIT;
		this.SIDEMENU_BACKDROP = typeof v.SIDEMENU_BACKDROP === 'boolean' && v.SIDEMENU_BACKDROP;
	}
}
