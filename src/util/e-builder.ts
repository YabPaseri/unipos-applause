/**
 * document.createElement() と 後続の作業を一度にやるためのもの。
 */
export class EBuilder<K extends keyof HTMLElementTagNameMap> {
	private constructor(
		private e: HTMLElementTagNameMap[K], //
		private next = true
	) {}
	public static begin<K extends keyof HTMLElementTagNameMap>(tag: K): EBuilder<K> {
		return new EBuilder(document.createElement(tag));
	}

	public if(test: boolean | (() => boolean)): this {
		this.next = typeof test === 'function' ? test() : test;
		return this;
	}
	private get skip(): boolean {
		if (this.next) return false;
		this.next = true;
		return true;
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

	public end(): HTMLElementTagNameMap[K] {
		return this.e;
	}
}
