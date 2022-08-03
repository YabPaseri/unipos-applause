import { DEBUG } from '../util';
import { InsertableObserver } from './insertable-observer';

export class CardModalObserver extends InsertableObserver {
	protected started_msg = 'card modal observer started';
	protected stopped_msg = 'card modal observer stopped';

	protected get target(): HTMLElement | null {
		return document.getElementById('content');
	}
	protected get options(): MutationObserverInit {
		return { childList: true };
	}
	protected observed(mutations: MutationRecord[]): void {
		loop: for (const mutation of mutations) {
			if (mutation.addedNodes.length === 0) continue;
			for (const added of Array.from(mutation.addedNodes)) {
				if (!(added instanceof HTMLElement)) continue;
				if (added.classList.contains('cardModalBackGround')) {
					this.insert(added);
					DEBUG.log('detected card modal open');
					break loop;
				}
			}
		}
	}
}
