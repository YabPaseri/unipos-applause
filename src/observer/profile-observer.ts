import { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';
import { InsertableObserver } from './insertable-observer';

export class ProfileObserver extends ApplauseObserver {
	public static runnable(): boolean {
		return (
			document.querySelector('div.profile___profile--profileWrap') !== null || // 新
			document.querySelector('div.profileWrap') !== null // 旧
		);
	}

	private mutation_obs: MutationObserver;
	private timeline_obs: ProfileTLObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
		this.timeline_obs = new ProfileTLObserver();
	}

	protected start(): boolean {
		const target =
			document.querySelector('.profile___profile--profileWrap') || // 新
			document.querySelector('.profileWrap'); // 旧
		if (!target) return false;
		this.mutation_obs.observe(target, { childList: true });
		this.timeline_obs.observe();
		DEBUG.log('profile observer started');
		return true;
	}

	protected stop(): void {
		this.mutation_obs.disconnect();
		this.timeline_obs.disconnect();
		DEBUG.log('profile observer stopped');
	}

	private observed(mutations: MutationRecord[]) {
		loop: for (const mutation of mutations) {
			for (const added of Array.from(mutation.addedNodes)) {
				if (!(added instanceof HTMLElement)) continue;
				if (added.querySelector('.timeline-body')) {
					this.timeline_obs.disconnect();
					this.timeline_obs.observe();
					break loop;
				}
			}
		}
	}
}

class ProfileTLObserver extends InsertableObserver {
	protected started_msg = 'profile timeline observer started';
	protected stopped_msg = 'profile timeline observer stopped';

	protected get target(): HTMLElement | null {
		return document.querySelector('.timeline-body > div');
	}
	protected get options(): MutationObserverInit {
		return { childList: true };
	}

	protected started(_target: HTMLElement): void {
		this.insert(...Array.from(_target.childNodes));
	}
	protected observed(mutations: MutationRecord[]): void {
		DEBUG.log('detected profile timeline update');
		for (const mutation of mutations) {
			this.insert(...Array.from(mutation.addedNodes));
		}
		const first = this.target?.firstElementChild;
		if (first) this.insert(first);
	}
}
