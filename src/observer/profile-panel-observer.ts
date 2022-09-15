import { ProfileMenu } from '../elements';
import { Options } from '../options';
import { CLS, SLCT } from '../styles';
import { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * ヘッダーのプロフィールアイコンをクリックしたときに表示される\
 * メニューが開かれることを検知するオブザーバ。\
 * 開かれたメニューに対して、任意のメニュー項目を追加する。
 */
export class ProfilePanelObserver extends UAObserver {
	private mutation_obs: MutationObserver;

	constructor() {
		super();
		this.mutation_obs = new MutationObserver(this.observed.bind(this));
	}

	protected start(): boolean {
		const target = document.querySelector(SLCT.HEADER_PROFILE);
		if (!target) return false;
		this.mutation_obs.observe(target, { childList: true });
		DEBUG.log('profile panel observer started');
		return true;
	}
	protected stop(): void {
		this.mutation_obs.disconnect();
		DEBUG.log('profile panel observer stopped');
	}

	private observed(mutations: MutationRecord[]) {
		for (const added of mutations.flatMap((m) => Array.from(m.addedNodes))) {
			if (!(added instanceof HTMLElement)) continue;
			if (added.classList.contains(CLS.HEADER_PROFILE_PANEL)) {
				DEBUG.log('detected profile panel open');
				this.insert(added);
				break;
			}
		}
	}

	private static CHECKBOX_ICON = chrome.runtime.getURL('img/checkbox.svg');
	private static CHECKBOX_ACTIVE_ICON = chrome.runtime.getURL('img/checkbox-active.svg');

	private insert(ele: HTMLElement) {
		const d_check = ProfilePanelObserver.CHECKBOX_ICON; // d(isable)-check = チェックされていない
		const e_check = ProfilePanelObserver.CHECKBOX_ACTIVE_ICON; // e(nable)-check = チェックされた

		// サイドメニューにバックドロップを表示
		const wrapper = ele.querySelector(SLCT.HEADER_PROFILE_LOGOUT_GROUP);
		const settings = wrapper?.querySelector(SLCT.HEADER_PROFILE_MENU_CONFIG);
		if (wrapper && settings) {
			const sidemenu_ol = ProfileMenu.create(
				Options.SIDEMENU_BACKDROP ? e_check : d_check,
				'サイドメニューを展開時に\nバックドロップを表示',
				'サイドメニューが開閉できる状態かつ展開されている時にバックドロップを表示します。バックドロップをクリックすることでも、メニューが閉じるようになります。'
			);
			sidemenu_ol.addEventListener('click', (e) => {
				const next = !Options.SIDEMENU_BACKDROP;
				Options.SIDEMENU_BACKDROP = next;
				Options.save();
				const img = (<HTMLElement>e.currentTarget).getElementsByTagName('img')[0];
				if (img) img.src = next ? e_check : d_check;
			});
			// 設定ボタンの前に入れる
			wrapper.insertBefore(sidemenu_ol, settings);
		}
	}
}
