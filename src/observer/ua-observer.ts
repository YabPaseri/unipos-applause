/**
 * 各オブザーバのベースクラス。
 */
export abstract class UAObserver {
	protected observing: boolean;
	constructor() {
		this.observing = false;
	}

	/**
	 * オブザーバの起動。\
	 * 起動済 or 起動成功 で `true`が返る。
	 */
	public observe(): boolean {
		if (this.observing) return true;
		return (this.observing = this.start());
	}
	/**
	 * オブザーバの停止。
	 */
	public disconnect(): void {
		if (!this.observing) return;
		this.stop();
		this.observing = false;
	}

	protected abstract start(): boolean;
	protected abstract stop(): void;
}
