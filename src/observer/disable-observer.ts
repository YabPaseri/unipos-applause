import { Applause } from '../elements';
import { CLS, SLCT } from '../styles';
import Util, { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * 拍手のアクティブの変化を検知するオブザーバ。\
 * 拍手を上限まで送ってボタンを押せなくなったときなど、\
 * 拍手のアクティブが変化したときに、その横にある拍手+のアクティブも揃える。
 */
export class DisableObserver extends UAObserver {
	private mutation_obs: MutationObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		// SLCTには '#' 付きで書かれているので...
		const target = document.getElementById(SLCT.CONTENT.substring(1));
		if (!target) return false;
		this.mutation_obs.observe(target, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
		DEBUG.log('disable observer started');
		return true;
	}
	protected stop(): void {
		this.mutation_obs.disconnect();
		DEBUG.log('disable observer stopped');
	}

	private observed(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (!(mutation.target instanceof HTMLElement)) continue;
			// 拍手だけ対象(+は対象外)
			const classes = mutation.target.classList;
			if (!classes.contains(CLS.CLAP) || classes.contains(CLS.APPLAUSE)) continue;

			const prev = mutation.oldValue?.split(' ').includes(CLS.DISABLE) || false;
			const next = classes.contains(CLS.DISABLE);
			if (prev === next) continue;

			const applause =
				// <? class="clap cf ua-applause-parent"/> まで戻った後に
				// その子孫にある 拍手+ を探す
				Util.ancestor(mutation.target, (ele) => {
					const c = ele.classList.contains.bind(ele.classList);
					return c(CLS.CLAP_PARENT_1) && c(CLS.CLAP_PARENT_2) && c(CLS.APPLAUSE_PARENT);
				})?.querySelector<HTMLElement>(SLCT.clsfy(CLS.CLAP, CLS.APPLAUSE));

			if (applause) {
				Applause.disable(applause, next);
				DEBUG.log('detected disable change');
			}
		}
	}
}
