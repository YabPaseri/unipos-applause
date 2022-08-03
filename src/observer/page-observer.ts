import { Options } from '../options';
import { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';
import { ProfileObserver } from './profile-observer';
import { TimelineObserver } from './timeline-observer';

export class PageObserver extends ApplauseObserver {
	private mutation_obs: MutationObserver;
	private pages_obs: ApplauseObserver | undefined;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		const target = document.querySelector('div.header_h1Container > div');
		if (!target) return false;
		this.mutation_obs.observe(target, { childList: true, characterData: true, subtree: true });
		this.observed(); // 1回目
		DEBUG.log('page observer started.');
		return true;
	}

	protected stop(): void {
		this.mutation_obs.disconnect();
		this.clearPages();
		DEBUG.log('page observer stopped.');
	}

	private clearPages() {
		this.pages_obs?.disconnect();
		this.pages_obs = void 0;
	}

	private lastObserved: Date | undefined;
	private async observed() {
		this.clearPages();
		DEBUG.log('detected page chage');
		const date = new Date();
		this.lastObserved = date; // インスタンスの違いしか見てないので、Dateにこだわりはない。
		for (let i = 0; i < Options.p.TRY_LIMIT; i++) {
			if (i !== 0) await new Promise((ok) => setTimeout(ok, Options.p.TRY_INTERVAL));
			if (this.lastObserved !== date) break;
			if (!this.pages_obs) {
				if (TimelineObserver.runnable()) {
					this.pages_obs = new TimelineObserver();
				} else if (ProfileObserver.runnable()) {
					this.pages_obs = new ProfileObserver();
				}
			}
			if (this.pages_obs && this.pages_obs.observe()) break;
		}
	}
}
