import { ClapPlus } from '../components';
import { ClassName } from '../styles';
import Util, { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';

export class DisableObserver extends ApplauseObserver {
	private mutation_obs: MutationObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		const target = document.getElementById('content');
		if (!target) return false;
		this.mutation_obs.observe(target, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
		DEBUG.log('disable observer started.');
		return true;
	}

	protected stop(): void {
		this.mutation_obs.disconnect();
		DEBUG.log('disable observer stopped.');
	}

	private observed(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (mutation.target.nodeType !== Node.ELEMENT_NODE) continue;
			const ele = <HTMLElement>mutation.target;

			// 拍手のみ対象(+は非対象)
			if (!ele.classList.contains(ClassName.CLAP) || ele.classList.contains(ClassName.APPLAUSE)) continue;

			const prev = mutation.oldValue?.split(' ').includes(ClassName.DISABLE) || false;
			const next = ele.classList.contains(ClassName.DISABLE);
			if (prev === next) continue;

			const clap_plus = Util.ancestorClass(ele, ['clap', 'cf', ClassName.APPLAUSE_CF]) // .clap.cf.ua-applause-cf まで戻る。
				?.querySelector<HTMLElement>(`.${ClassName.CLAP}.${ClassName.APPLAUSE}`);
			if (clap_plus) {
				ClapPlus.disabled(clap_plus, next);
				DEBUG.log('detected disable change');
			}
		}
	}
}
