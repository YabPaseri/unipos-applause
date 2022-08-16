import { Options } from '../options';
import { SLCT } from '../styles';
import Util, { DEBUG } from '../util';
import { HighlightsObserver } from './highlights-observer';
import { MemberInfoObserver } from './member-info-observer';
import { ProfileObserver } from './profile-observer';
import { TimelineObserver } from './timeline-observer';
import { UAObserver } from './ua-observer';

/**
 * ページ移動を検知するオブザーバ。\
 * Uniposはシングルページアプリケーション。よって、ページの遷移がない。\
 * 各ページごとの処理を行うために、ページの移動は検出しなければならない。\
 * 検出単位は「タイムライン」「名投稿まとめ」「設定」「プロフィール」。\
 * ページの移動を検知すると、\
 * 不要になったオブザーバを停止し、必要なオブザーバを起動する。
 */
export class PageObserver extends UAObserver {
	private mutation_obs: MutationObserver;
	private pages_obs: UAObserver | undefined;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		// ヘッダーに表示される「タイムライン」「名投稿まとめ」「設定」の文字の変化で検知する。
		// 「プロフィール」に該当する場合は空欄となる。
		const target = document.querySelector(SLCT.PAGE_TITLE);
		if (!target) return false;
		this.mutation_obs.observe(target, { childList: true, characterData: true, subtree: true });
		this.observed(); // 初回
		DEBUG.log('page observer started');
		return true;
	}
	protected stop(): void {
		this.mutation_obs.disconnect();
		this.disconnectPages();
		DEBUG.log('page observer stopped');
	}

	private disconnectPages() {
		if (this.pages_obs) {
			this.pages_obs.disconnect();
			this.pages_obs = void 0;
		}
	}

	private subscriber: string | undefined;
	private async observed() {
		DEBUG.log('detected page change');
		this.disconnectPages();
		// DOM要素の捜索中にページの移動を検知した場合は、進行中の捜索を止めなければならない。
		// for-loop の break の手段として、各loopにユニークなIDを振って、有効か否かをチェックする。
		const id = Util.uuid();
		this.subscriber = id;
		for (let i = 0; i < Options.TRY_LIMIT; i++) {
			if (i !== 0) await new Promise((ok) => setTimeout(ok, Options.TRY_INTERVAL));
			if (this.subscriber !== id) break;
			if (!this.pages_obs) {
				// タイムライン
				if (TimelineObserver.runnable()) {
					this.pages_obs = new TimelineObserver();
				}
				// プロフィール
				else if (ProfileObserver.runnable()) {
					this.pages_obs = new ProfileObserver();
				}
				// 名投稿まとめ
				else if (HighlightsObserver.runnable()) {
					this.pages_obs = new HighlightsObserver();
				}
				// 設定
				else if (MemberInfoObserver.runnable()) {
					this.pages_obs = new MemberInfoObserver();
				}
			}
			if (this.pages_obs && this.pages_obs.observe()) break;
		}
	}
}
