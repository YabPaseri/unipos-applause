export default abstract class Component {
	protected static E = class E<K extends keyof HTMLElementTagNameMap> {
		private constructor(private e: HTMLElementTagNameMap[K]) {}
		static tag<K extends keyof HTMLElementTagNameMap>(tag: K): E<K> {
			return new E(document.createElement(tag));
		}

		public classes(...tokens: string[]): E<K> {
			this.e.classList.add(...tokens);
			return this;
		}

		public text(text: string): E<K> {
			this.e.textContent = text;
			return this;
		}

		public src(src: string): E<K> {
			(<HTMLImageElement>this.e).src = src;
			return this;
		}

		public append(...nodes: (string | Node)[]): E<K> {
			this.e.append(...nodes);
			return this;
		}

		public child<KK extends keyof HTMLElementTagNameMap>(e: E<KK>): E<K> {
			this.append(e.create());
			return this;
		}

		public create(): HTMLElementTagNameMap[K] {
			return this.e;
		}
	};
}
