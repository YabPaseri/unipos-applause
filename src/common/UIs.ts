export class UIs {
	/**
	 * document.createElement() x メソッドチェーンによるカスタマイズ
	 */
	public static readonly create = <K extends keyof HTMLElementTagNameMap>(tag: K) => {
		return new UIs.UIBuilder(tag);
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

	private static UIBuilder = class UIBuilder<K extends keyof HTMLElementTagNameMap> {
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
	};
}
