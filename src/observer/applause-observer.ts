export interface IApplauseObserver {
	observe(): boolean;
	disconnect(): void;
}

export abstract class ApplauseObserver implements IApplauseObserver {
	protected observing: boolean;
	constructor() {
		this.observing = false;
	}

	observe(): boolean {
		if (this.observing) return true;
		return (this.observing = this.start());
	}

	disconnect(): void {
		if (this.observing) {
			this.stop();
			this.observing = false;
		}
	}

	protected abstract start(): boolean;
	protected abstract stop(): void;
}
