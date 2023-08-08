import { Component, Fragment } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { GlobalStyle, UIs } from '../ui';
import Alarm from './alarm';
import { Footer } from './components';
import Consumer from './consumer';
import Support from './support';

export class View extends Component<unknown> {
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

	private constructor(props: unknown) {
		super(props);
	}
	override render(): React.ReactNode {
		return (
			<Fragment>
				<GlobalStyle />
				<Footer>
					<Consumer />
					<Alarm />
					<Support />
				</Footer>
			</Fragment>
		);
	}
}
