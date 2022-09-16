import React from 'react';
import { createRoot, Root } from 'react-dom/client';

export class BulkSender {
	static #root: Root;
	private static get root(): Root {
		if (this.#root) return this.#root;
		const container = document.createElement('div');
		document.body.append(container);
		return (this.#root = createRoot(container));
	}

	static #on = false;
	public static on() {
		if (this.#on) return;
		this.root.render(<></>); // TODO
		this.#on = true;
	}
	public static off() {
		if (!this.#on) return;
		this.root.unmount();
		this.#on = false;
	}
}
