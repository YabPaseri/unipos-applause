import { IApplauseObserver } from './applause-observer';

export class Observers implements IApplauseObserver {
	private obss: IApplauseObserver[];
	constructor() {
		this.obss = [];
	}

	public add(obs: IApplauseObserver): Observers {
		if (!this.obss.includes(obs)) this.obss.push(obs);
		return this;
	}

	observe(): boolean {
		return this.obss.reduce((result, obs) => {
			const re = obs.observe();
			return result ? re : false;
		}, true);
	}

	disconnect(): void {
		for (const obs of this.obss) obs.disconnect();
	}
}
