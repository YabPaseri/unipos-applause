/**
 * 拡張機能が作るDOM要素に必要なクラス
 */
export class CLS {
	/**
	 * 拍手(Unipos)
	 */
	public static readonly CLAP = 'c-clapIcon';

	/**
	 * 拍手+(Extension)
	 */
	public static readonly APPLAUSE = 'ua-applause';

	/**
	 * 拍手非アクティブ(Unipos)
	 */
	public static readonly DISABLE = 'is-disable';

	/**
	 * 拍手+の親要素(Extension)
	 */
	public static readonly APPLAUSE_PARENT = 'ua-applause-parent';

	/**
	 * 拍手+の親要素のホバー(Extension)
	 */
	public static readonly HOVER = 'ua-hover';

	/**
	 * サイドメニューのz-index的な後ろに追加する背景(Extension)
	 */
	public static readonly SIDEMENU_BACKDROP = 'ua-sidemenu-backdrop';

	/**
	 * サイドメニューに追加する背景を表示(Extension)
	 */
	public static readonly SIDEMENU_BACKDROP_SHOW = 'ua-show';

	/**
	 * ヘッダーのプロフィールアイコンを押すと表示されるメニューのアイテム
	 */
	public static readonly HEADER_PROFILE_MENU = 'c-headerProfile_menu';
}

/**
 * クラス名の先頭に「.」をつける。
 */
export const selector = (value: string): string => {
	return `.${value}`;
};
