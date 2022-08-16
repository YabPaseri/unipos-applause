import { Options } from '../options';
import { SLCT } from '../styles';
import { DEBUG } from '../util';
import { InsertableObserver } from './insertable-observer';
import { UAObserver } from './ua-observer';

/**
 * PageObserverで「プロフィール」のページを検知したときに起動するオブザーバ。\
 * 「プロフィール」に表示しているユーザの切り替わりを検知し、\
 * 「プロフィール」内のタイムラインを監視するオブザーバを制御する。
 */
export class ProfileObserver extends UAObserver {
	public static runnable(): boolean {
		// v1.1.1
		// サイレントアップデートによって、クラスが変更された。
		// しばらく様子を見て、問題なさそうであれば新クラス側に完全移行
		return document.querySelector(SLCT.PF_PROOF) !== null;
	}

	private mutation_obs: MutationObserver;
	private timeline_obs: ProfileTLObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
		this.timeline_obs = new ProfileTLObserver();
	}

	protected start(): boolean {
		const target = document.querySelector(SLCT.PF_PROOF);
		if (!target) return false;
		this.mutation_obs.observe(target, { childList: true });
		const interval = setInterval(() => {
			if (this.timeline_obs.observe()) clearInterval(interval);
		}, Options.TRY_INTERVAL);
		DEBUG.log('profile observer started');
		return true;
	}
	protected stop(): void {
		this.mutation_obs.disconnect();
		this.timeline_obs.disconnect();
		DEBUG.log('profile observer stopped');
	}

	private observed(mutations: MutationRecord[]) {
		for (const added of mutations.flatMap((m) => Array.from(m.addedNodes))) {
			if (!(added instanceof HTMLElement)) continue;
			if (added.querySelector(SLCT.PF_CARDS) !== null) {
				DEBUG.log('detected profile change');
				this.timeline_obs.disconnect();
				this.timeline_obs.observe();
				break;
			}
		}
	}
}

/**
 * 「プロフィール」ページのタイムライン（もらった・おくった・拍手した）の\
 * 投稿の読み込みを検知して、拍手を追加するオブザーバ。\
 * 「プロフィール」に表示しているユーザが変化する度に、再起動が必要。
 */
class ProfileTLObserver extends InsertableObserver {
	protected started_msg = 'profile timeline observer started';
	protected stopped_msg = 'profile timeline observer stopped';

	protected get target(): HTMLElement | null {
		return document.querySelector(SLCT.PF_CARDS);
	}
	protected get options(): MutationObserverInit {
		return { childList: true };
	}

	protected override start(): boolean {
		const started = super.start();
		if (started) this.insert(...Array.from(this.target?.childNodes || []));
		return started;
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
