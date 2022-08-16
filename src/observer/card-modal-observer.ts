import { CLS, SLCT } from '../styles';
import { DEBUG } from '../util';
import { InsertableObserver } from './insertable-observer';

/**
 * 投稿がモーダルで開かれたことを検知するオブザーバ。\
 * 引用投稿の引用元 や 通知欄から開く投稿 などが該当する。\
 * 開かれた投稿に拍手+を追加する。
 */
export class CardModalObserver extends InsertableObserver {
	protected started_msg = 'card modal observer started';
	protected stopped_msg = 'card modal observer stopped';

	protected get target(): HTMLElement | null {
		return document.getElementById(SLCT.CONTENT.substring(1));
	}
	protected get options(): MutationObserverInit {
		return { childList: true };
	}

	protected observed(mutations: MutationRecord[]): void {
		for (const added of mutations.flatMap((m) => Array.from(m.addedNodes))) {
			if (!(added instanceof HTMLElement)) continue;
			if (added.classList.contains(CLS.CARD_MODAL_BG)) {
				DEBUG.log('detected card modal open');
				this.insert(added);
				break;
			}
		}
	}
}
