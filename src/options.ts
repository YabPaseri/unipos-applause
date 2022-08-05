export class Options {
	private static _p: Options;
	public static get p(): Options {
		return Options._p;
	}

	private constructor(
		//
		public DEBUG: boolean,
		public TRY_INTERVAL: number,
		public TRY_LIMIT: number,
		public NO_CHECK: boolean,
		public NO_SPLIT: boolean
	) {}

	private static defaultize<T extends string | number | boolean | undefined>(v: unknown, def: T, check?: (v: T) => boolean): T {
		if (typeof v !== typeof def) return def;
		if (!check) return v as T;
		return check(v as T) ? (v as T) : def;
	}

	static positiveInt(v: unknown): boolean {
		return Number.isSafeInteger(v) && (v as number) > 0;
	}
	static async load(): Promise<void> {
		if (Options._p) return Promise.resolve();
		const s = await chrome.storage.local.get(null);
		const DEBUG = this.defaultize<boolean>(s['DEBUG'], false);
		const TRY_INTERVAL = this.defaultize<number>(s['TRY_INTERVAL'], 250, this.positiveInt);
		const TRY_LIMIT = this.defaultize<number>(s['TRY_LIMIT'], 40, this.positiveInt);
		const NO_CHECK = this.defaultize<boolean>(s['NO_CHECK'], false);
		const NO_SPLIT = this.defaultize<boolean>(s['NO_SPLIT'], false);
		Options._p = new Options(DEBUG, TRY_INTERVAL, TRY_LIMIT, NO_CHECK, NO_SPLIT);
	}

	async save(): Promise<void> {
		await chrome.storage.local.clear();
		await chrome.storage.local.set(JSON.parse(JSON.stringify(this)));
	}
}
