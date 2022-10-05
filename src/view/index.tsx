import { Component, Fragment } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Empty } from '../type';
import UIs, { GlobalStyle } from '../ui';
import { Footer } from './components';
import Consumer from './consumer';
import Support from './support';

export class View extends Component<Empty> {
	static #root: Root;
	private static get root(): Root {
		if (this.#root) return this.#root;
		const container = UIs.create('div').appendTo(document.body).done();
		return (this.#root = createRoot(container));
	}

	static #on = false;
	public static readonly on = () => {
		if (this.#on) return;
		this.root.render(<View />);
		this.#on = true;
	};
	public static readonly off = () => {
		if (!this.#on) return;
		this.root.unmount();
		this.#on = false;
	};

	private constructor(props: Empty) {
		super(props);
	}
	override render(): React.ReactNode {
		return (
			<Fragment>
				<GlobalStyle />
				<Footer>
					<Consumer />
					<Support />
				</Footer>
			</Fragment>
		);
	}
}
