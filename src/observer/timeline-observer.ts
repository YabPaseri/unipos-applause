import { DEBUG } from '../util';
import { InsertableObserver } from './insertable-observer';

/**
 * PageObserverで「タイムライン」のページを検知したときに起動するオブザーバ。\
 * 「タイムライン」内における投稿の読み込みを検知し、拍手+を追加する。
 */
export class TimelineObserver extends InsertableObserver {
	public static runnable(): boolean {
		return document.querySelector('div.pageNav') !== null;
	}

	protected started_msg = 'timeline observer started';
	protected stopped_msg = 'timeline observer stopped';

	protected get target(): HTMLElement | null {
		return document.querySelector('div.cards');
	}
	protected get options(): MutationObserverInit {
		return { childList: true };
	}

	protected override start(): boolean {
		const started = super.start();
		if (started) this.insert(...Array.from(this.target?.childNodes || []));
		return started;
	}

	protected observed(mutations: MutationRecord[]): void {
		DEBUG.log('detected timeline update');
		for (const mutation of mutations) {
			this.insert(...Array.from(mutation.addedNodes));
		}
		const first = this.target?.firstElementChild;
		if (first) this.insert(first);
	}
}
