import { ApplauseClickObserver } from './observer/applause-click-observer';
import { CardModalObserver } from './observer/card-modal-observer';
import { DisableObserver } from './observer/disable-observer';
import { HoverObserver } from './observer/hover-observer';
import { PageObserver } from './observer/page-observer';
import { ProfilePanelObserver } from './observer/profile-panel-observer';
import { SideMenuObserver } from './observer/sidemenu-observer';
import { UAObserver } from './observer/ua-observer';
import { Options } from './options';
import { DEBUG } from './util';

// ROOT
(async () => {
	await Options.init();
	DEBUG.log('extension loaded');

	const obss = new Observers()
		.add(new DisableObserver())
		.add(new HoverObserver())
		.add(new ApplauseClickObserver())
		.add(new CardModalObserver())
		.add(new ProfilePanelObserver())
		.add(new SideMenuObserver())
		.add(new PageObserver());

	let success = false;
	for (let i = 0; i < Options.TRY_LIMIT; i++) {
		if (i !== 0) await new Promise((ok) => setTimeout(ok, Options.TRY_INTERVAL));
		if ((success = obss.observe())) break;
	}
	if (!success) {
		obss.disconnect();
		DEBUG.log('extension stopped');
	}
})();

// UAObserver をまとめて起動・まとめてストップさせるためのもの。
class Observers {
	private obss: UAObserver[] = [];
	public add(observer: UAObserver): this {
		if (!this.obss.includes(observer)) this.obss.push(observer);
		return this;
	}
	// 1つでも起動できていない場合は `false` が返る。
	// 起動に成功したものは、起動させたまま。
	public observe(): boolean {
		return this.obss.reduce((result, o) => {
			const r = o.observe();
			return result ? r : false;
		}, true);
	}
	// 全て止める。
	public disconnect(): void {
		for (const o of this.obss) o.disconnect();
	}
}
