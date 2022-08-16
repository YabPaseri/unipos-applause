import { Applause } from '../components';
import { CLS, SLCT } from '../styles';
import { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * 拍手+の追加を行うオブザーバのベースクラス。
 */
export abstract class InsertableObserver extends UAObserver {
	protected mutation_obs: MutationObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected abstract started_msg: string;
	protected start(): boolean {
		const target = this.target;
		if (!target) return false;
		this.mutation_obs.observe(target, this.options);
		DEBUG.log(this.started_msg);
		return true;
	}

	protected abstract stopped_msg: string;
	protected stop(): void {
		this.mutation_obs.disconnect();
		DEBUG.log(this.stopped_msg);
	}

	/** MutationObserverのターゲット */
	protected abstract get target(): HTMLElement | null;
	/** MutationObserverの設定 */
	protected abstract get options(): MutationObserverInit;

	/** MutationObserverのコールバック */
	protected abstract observed(mutations: MutationRecord[]): void;

	/**
	 * 引数に渡された各カード(投稿)に、拍手+を追加する。
	 */
	protected insert(...cards: Node[]) {
		for (const card of cards) {
			if (!(card instanceof HTMLElement)) continue;

			const claps_parent = card.querySelector(SLCT.clsfy(CLS.CLAP_PARENT_1, CLS.CLAP_PARENT_2));
			if (!claps_parent) continue;

			const clap = (() => {
				const claps = claps_parent.querySelectorAll(SLCT.clsfy(CLS.CLAP));
				return claps.length === 1 ? claps[0] : void 0;
			})();
			if (!clap) continue;

			claps_parent.classList.add(CLS.APPLAUSE_PARENT);
			const applause = Applause.create(clap.classList.contains(CLS.DISABLE));
			claps_parent.append(applause);
		}
	}
}
