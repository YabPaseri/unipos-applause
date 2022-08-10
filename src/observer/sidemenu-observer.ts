import { Options, ROptions } from '../options';
import { CLS, selector } from '../styles';
import { DEBUG, EBuilder } from '../util';
import { UAObserver } from './ua-observer';

/**
 * サイドメニューの状態を検知するオブザーバ。\
 * 「開閉可能か」「現在閉じられているか」を検知し、\
 * 設定に従ってサイドメニューにバックドロップを追加する。\
 * 追加されたバックドロップをクリックすることでも、\
 * サイドメニューが閉じるようになる。
 */
export class SideMenuObserver extends UAObserver {
	private resize_obs: ResizeObserver;
	private mutation_obs: MutationObserver;

	// サイドメニューが開閉可能な状態か
	private togglable: boolean;
	// クラス上は、サイドメニューが隠れているか
	private is_hidden: boolean;

	constructor() {
		super();
		this.resize_obs = new ResizeObserver(this.observedResize.bind(this));
		this.mutation_obs = new MutationObserver(this.observedMutation.bind(this));
		this.is_hidden = false;
		this.togglable = false;
	}

	protected start(): boolean {
		const hamburger = document.querySelector<HTMLElement>('.c-sideHamburgerBtn');
		const sidemenu = document.querySelector<HTMLElement>('.c-side.sideMenu');
		if (!sidemenu || !hamburger) return false;
		this.resize_obs.observe(hamburger);
		this.mutation_obs.observe(sidemenu, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
		this.updateTogglable(hamburger, true);
		this.updateIsHidden(sidemenu, true);
		this.draw();
		Options.addListener(this.optionsListener);
		DEBUG.log('sidemenu observer started');
		return true;
	}
	protected stop(): void {
		this.resize_obs.disconnect();
		this.mutation_obs.disconnect();
		Options.removeListener(this.optionsListener);
		DEBUG.log('sidemenu observer stopped');
	}

	private observedResize(entries: ResizeObserverEntry[]) {
		for (const entry of entries) {
			if (!(entry.target instanceof HTMLElement)) continue;
			DEBUG.log('detected sidemenu togglable change');
			this.updateTogglable(entry.target);
			break; // 最初の1つだけ(entries.length === 1 だとは思うけど)
		}
	}
	private updateTogglable(ele: HTMLElement, init = false) {
		if (this.togglable !== (ele.getBoundingClientRect().height !== 0)) {
			this.togglable = !this.togglable;
			if (!init) this.draw();
		}
	}

	private observedMutation(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (!(mutation.target instanceof HTMLElement)) continue;
			DEBUG.log('detected sidemenu show change');
			this.updateIsHidden(mutation.target);
			break; // 最初の1つだけ(mutations.length === 1 だとは思うけど)
		}
	}
	private updateIsHidden(ele: HTMLElement, init = false) {
		if (this.is_hidden !== ele.classList.contains('c-is-containerHidden')) {
			this.is_hidden = !this.is_hidden;
			if (!init) this.draw();
		}
	}

	// あれば既存の要素を返し、なければ作る→挿入する→返す のステップを踏む
	private get backdrop(): HTMLElement {
		const b = document.querySelector<HTMLElement>(selector(CLS.SIDEMENU_BACKDROP));
		if (b) return b;
		const nb = EBuilder.begin('div')
			.classes(CLS.SIDEMENU_BACKDROP)
			.event('click', () => {
				document.querySelector<HTMLButtonElement>('.c-slideButton.c-slideButton-slideLeft')?.click();
			})
			.end();
		document.body.append(nb);
		return nb;
	}

	// (設定が有効であると仮定して)
	// サイドメニューが 開閉可能 かつ 展開中のクラスを持っている 場合にだけ
	// 背景(backdrop) が出るようにする。
	private draw() {
		if (Options.SIDEMENU_BACKDROP && this.togglable && !this.is_hidden) {
			this.backdrop.classList.add(CLS.SIDEMENU_BACKDROP_SHOW);
		} else {
			this.backdrop.classList.remove(CLS.SIDEMENU_BACKDROP_SHOW);
		}
	}

	/**
	 * Optionsの値の変化を受け取るリスナー。\
	 * 引数に古い値が渡ってくるので、現在の値と比較して使う。
	 */
	private optionsListener = this.oListener.bind(this);
	private oListener(old: ROptions) {
		if (old.SIDEMENU_BACKDROP !== Options.SIDEMENU_BACKDROP) {
			this.draw();
		}
	}
}
