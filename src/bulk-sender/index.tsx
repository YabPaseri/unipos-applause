import React, { Fragment } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Options } from '../options';
import { CLS, SLCT } from '../styles';
import { EBuilder } from '../util';
import { OpenButton } from './components';
import { SendDialog } from './SendDialog';

export default class BulkSender extends React.Component {
	static #root: Root;
	private static get root(): Root {
		if (this.#root) return this.#root;
		const container = EBuilder.begin('div').classes(CLS.HIDDEN).end();
		document.body.append(container);
		return (this.#root = createRoot(container));
	}

	static #on = false;
	public static async on() {
		if (this.#on) return;
		// 「サポート」の要素が見つかるまで待機。
		while (!document.querySelector(SLCT.SUPPORT)) {
			await new Promise((ok) => setTimeout(ok, Options.TRY_INTERVAL));
		}
		document.querySelector(SLCT.SUPPORT)?.classList.add(CLS.HIDDEN);
		this.root.render(<BulkSender />);
		this.#on = true;
	}
	public static off() {
		if (!this.#on) return;
		document.querySelector(SLCT.SUPPORT)?.classList.remove(CLS.HIDDEN);
		this.root.unmount();
		this.#on = false;
	}

	private constructor(props: never) {
		super(props);
		this.open = this.open.bind(this);
		this.setOpener = this.setOpener.bind(this);
	}

	private opener?: () => void;
	private setOpener(opener: NonNullable<typeof this.opener>) {
		this.opener = opener;
	}
	private open() {
		this.opener && this.opener();
	}

	render(): React.ReactNode {
		return (
			<Fragment>
				<OpenButton onClick={this.open} />
				<SendDialog setOpener={this.setOpener} />
			</Fragment>
		);
	}
}
