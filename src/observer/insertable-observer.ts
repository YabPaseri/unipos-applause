import { ClapPlus as CP } from '../components';
import { ClassName } from '../styles';
import { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';

export abstract class InsertableObserver extends ApplauseObserver {
	protected mutation_obs: MutationObserver;
	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		const target = this.target;
		if (!target) return false;
		this.mutation_obs.observe(target, this.options);
		this.started(target);
		DEBUG.log(this.started_msg);
		return true;
	}

	protected stop(): void {
		this.mutation_obs.disconnect();
		DEBUG.log(this.stopped_msg);
	}

	protected abstract started_msg: string;
	protected abstract stopped_msg: string;

	protected abstract get target(): HTMLElement | null;
	protected abstract get options(): MutationObserverInit;

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	protected started(_target: HTMLElement) {}
	protected abstract observed(mutations: MutationRecord[]): void;

	protected insert(...nodes: Node[]) {
		for (const node of nodes) {
			if (!(node instanceof HTMLElement)) continue;

			const clapcf = node.querySelector<HTMLElement>('.clap.cf');
			if (!clapcf) continue;

			const clap = (() => {
				const claps = clapcf.querySelectorAll(`.${ClassName.CLAP}`);
				return claps.length === 1 ? claps[0] : void 0;
			})();
			if (!clap) continue;

			clapcf.classList.add(ClassName.APPLAUSE_CF);
			const clapplus = CP.create(clap.classList.contains(ClassName.DISABLE));
			clapcf.appendChild(clapplus);
		}
	}
}
