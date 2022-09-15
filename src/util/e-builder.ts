/**
 * document.createElement() と 後続の作業を一度にやるためのもの。
 */
export class EBuilder<K extends keyof HTMLElementTagNameMap> {
	private constructor(
		private e: HTMLElementTagNameMap[K], //
		private skip = false
	) {}
	public static begin<K extends keyof HTMLElementTagNameMap>(tag: K): EBuilder<K> {
		return new EBuilder(document.createElement(tag));
	}

	public if(test: boolean | (() => boolean)): this {
		this.skip = typeof test === 'function' ? !test() : !test;
		return this;
	}
	public fi(): this {
		this.skip = false;
		return this;
	}

	public title(title: string): this {
		if (this.skip) return this;
		this.e.title = title;
		return this;
	}

	public classes(...classes: string[]): this {
		if (this.skip) return this;
		this.e.classList.add(...classes);
		return this;
	}

	public text(text: string): this {
		if (this.skip) return this;
		this.e.textContent = text;
		return this;
	}

	public itext(innerText: string): this {
		if (this.skip) return this;
		this.e.innerText = innerText;
		return this;
	}

	public src(src: string): this {
		if (this.skip) return this;
		(<HTMLImageElement>this.e).src = src;
		return this;
	}

	public append(...nodes: (string | Node)[]): this {
		if (this.skip) return this;
		this.e.append(...nodes);
		return this;
	}

	public child<L extends keyof HTMLElementTagNameMap>(b: EBuilder<L>): this {
		if (this.skip) return this;
		this.append(b.end());
		return this;
	}

	public event<L extends keyof HTMLElementEventMap>(
		type: L,
		listener: (ev: HTMLElementEventMap[L]) => unknown,
		options?: boolean | AddEventListenerOptions
	): this {
		if (this.skip) return this;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.e.addEventListener(type, <any>listener, options);
		return this;
	}

	public end(): HTMLElementTagNameMap[K] {
		return this.e;
	}
}
