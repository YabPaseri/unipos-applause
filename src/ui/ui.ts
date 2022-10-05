// import { CLS } from './cls';
// import { SLCT } from './slct';

import { CLS } from './cls';
import { SLCT } from './slct';

export class UIs {
	/**
	 * document.createElement() x メソッドチェーンによるカスタマイズ
	 */
	public static readonly create = <K extends keyof HTMLElementTagNameMap>(tag: K) => {
		return new UIBuilder(tag);
	};

	public static readonly find = <T extends HTMLElement>(key: keyof typeof SLCT): T | null => {
		return document.querySelector(SLCT[key]);
	};

	public static readonly class = <T extends HTMLElement>(ele: T, mode: '+' | '-', ...cls: (keyof typeof CLS)[]): T => {
		const list = ele.classList;
		for (const c of cls.map((cc) => CLS[cc])) {
			mode === '+' ? list.add(c) : list.remove(c);
		}
		return ele;
	};
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
