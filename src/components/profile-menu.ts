import { CLS } from '../styles';
import { EBuilder } from '../util';

/**
 * ヘッダーのプロフィールアイコンを押すと表示される\
 * メニューに関する実装
 */
export class ProfileMenu {
	/**
	 * 作成
	 */
	public static create(src: string, innerText: string, title?: string): HTMLElement {
		//<a class="c-headerProfile_menu">
		//	<img src={src}/>
		//	<span>{innerText}</span>
		//</a>
		return EBuilder.begin('a')
			.if(title !== void 0)
			.title(<string>title)
			.classes(CLS.HEADER_PROFILE_MENU)
			.child(EBuilder.begin('img').src(src))
			.child(EBuilder.begin('span').itext(innerText))
			.end();
	}
}
