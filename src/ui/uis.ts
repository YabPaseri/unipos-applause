export class UIs {
	/**
	 * document.createElement() x メソッドチェーンによるカスタマイズ
	 */
	public static readonly create = <K extends keyof HTMLElementTagNameMap>(tag: K) => {
		return new UIBuilder(tag);
	};

	/**
	 * document.querySelector のシンタックスシュガー
	 */
	public static readonly find = <T extends HTMLElement>(selectors: string): T | null => {
		return document.querySelector<T>(selectors);
	};
	/**
	 * document.querySelectorAll のシンタックスシュガー
	 */
	public static readonly finds = <T extends HTMLElement>(selectors: string): NodeListOf<T> => {
		return document.querySelectorAll<T>(selectors);
	};

	/**
	 * HTML要素のクラス操作
	 */
	public static readonly class = <T extends HTMLElement>(ele: T, mode: 'add' | 'remove', ...cls: string[]) => {
		const fn = mode === 'add' ? ele.classList.add.bind(ele.classList) : ele.classList.remove.bind(ele.classList);
		fn(...cls);
	};

	public static readonly selectors = {
		/** Uniposのサポートダイアログを開くボタンのiframe */
		SUPPORT: '#launcher',
		/** メンバー検索をした際に追加される要素を特定するもの その1 */
		MEMBER_SEARCHED_ELE_1: 'div > script[src="https://tag.web.onesdata.com/od.js"]',
		/** メンバー検索をした際に追加される要素を特定するもの その2 */
		MEMBER_SEARCHED_ELE_2: 'div > script[src="https://b90.yahoo.co.jp/conv.js"]',
		/** メンバー検索をした際に追加される要素を特定するもの その3 */
		MEMBER_SEARCHED_ELE_3: 'div > script[src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"]',
	} as const;

	public static readonly classes = {
		/** 非表示 */
		HIDDEN: 'au-hidden',
	} as const;
}

class UIBuilder<K extends keyof HTMLElementTagNameMap> {
	private e: HTMLElementTagNameMap[K];
	private skip: boolean;
	constructor(tag: K) {
		this.e = document.createElement(tag);
		this.skip = false;
	}

	public readonly if = (test: boolean | (() => boolean)): this => {
		this.skip = typeof test === 'boolean' ? !test : !test();
		return this;
	};
	public readonly fi = (): this => {
		this.skip = false;
		return this;
	};

	public readonly classes = (...classes: string[]): this => {
		if (this.skip) return this;
		this.e.classList.add(...classes);
		return this;
	};

	public readonly appendTo = (parent: HTMLElement): this => {
		if (this.skip) return this;
		parent.append(this.e);
		return this;
	};

	public readonly done = (): HTMLElementTagNameMap[K] => {
		return this.e;
	};
}
