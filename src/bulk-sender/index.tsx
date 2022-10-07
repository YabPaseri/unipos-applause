import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Options } from '../options';
import { CLS, SLCT } from '../styles';
import { EBuilder } from '../util';
import { OpenDialogButton } from './OpenDialogButton';
import { SenderDialog } from './SenderDialog';

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
		if (this.#on || !Options.BETA) return;
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
	}

	render(): React.ReactNode {
		return (
			<RecoilRoot>
				<OpenDialogButton />
				<SenderDialog />
			</RecoilRoot>
		);
	}
}
