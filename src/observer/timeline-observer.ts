import { DEBUG } from '../util';
import { InsertableObserver } from './insertable-observer';

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

	protected started(_target: HTMLElement): void {
		this.insert(...Array.from(_target.childNodes));
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
