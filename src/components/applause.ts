import { CLS } from '../styles';
import { EBuilder } from '../util';

/**
 * 拍手+ に関する実装
 */
export class Applause {
	/**
	 * 作成
	 */
	public static create(disabled = false): HTMLElement {
		return EBuilder.begin('button')
			.classes(CLS.CLAP, CLS.APPLAUSE)
			.if(disabled)
			.classes(CLS.DISABLE)
			.child(EBuilder.begin('span').text('+'))
			.end();
	}

	/**
	 * 引数の要素が拍手+が持つクラスを持っているか
	 */
	public static is(e: HTMLElement): boolean {
		return e.classList.contains(CLS.CLAP) && e.classList.contains(CLS.APPLAUSE);
	}

	/**
	 * 引数の拍手+の非アクティブをforceに切り替える
	 */
	public static disable(e: HTMLElement, force: boolean): void {
		if (!this.is(e)) return;
		const classes = e.classList;
		if (force) {
			classes.add(CLS.DISABLE);
		} else {
			classes.remove(CLS.DISABLE);
		}
	}
}
