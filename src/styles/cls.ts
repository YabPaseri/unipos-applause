/**
 * 拡張機能が作るDOM要素に必要なクラス
 */
export class CLS {
	/**
	 * 拍手(Unipos)
	 */
	public static readonly CLAP = 'c-clapIcon';

	/**
	 * 投稿
	 */
	public static readonly CARD = 'card___card--card';

	/**
	 * 拍手や拍手数の親要素(1)
	 */
	public static readonly CLAP_PARENT_1 = 'card___clap--clap';
	/**
	 * 拍手や拍手数の親要素(2)
	 */
	public static readonly CLAP_PARENT_2 = 'cf';

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
	 * サイドメニューが非表示状態であることを表すクラス(Unipos)
	 */
	public static readonly SIDEMENU_HIDDEN = 'c-is-containerHidden';

	/**
	 * サイドメニューのz-index的な後ろに追加する背景(Extension)
	 */
	public static readonly SIDEMENU_BACKDROP = 'ua-sidemenu-backdrop';

	/**
	 * サイドメニューに追加する背景を表示(Extension)
	 */
	public static readonly SIDEMENU_BACKDROP_SHOW = 'ua-show';

	/**
	 * ヘッダーのプロフィールアイコンを押すと表示されるメニュー
	 */
	public static readonly HEADER_PROFILE_PANEL = 'c-headerProfile_panel';

	/**
	 * ヘッダーのプロフィールアイコンを押すと表示されるメニューのアイテム
	 */
	public static readonly HEADER_PROFILE_MENU = 'c-headerProfile_menu';

	/**
	 * モーダルで表示される投稿の背景
	 */
	public static readonly CARD_MODAL_BG = 'cardModalBackGround';

	/**
	 * モーダルで表示される投稿
	 */
	public static readonly CARD_MODAL = 'cardModal';

	/**
	 * bodyに付けることで、対応するクラスを持つ要素を非表示にする
	 */
	public static readonly HIDDEN_ROOT = 'ua-hidden-root';
	/**
	 * CLS.HIDDEN_ROOT をbodyが持つときに、非表示にする
	 */
	public static readonly HIDDEN = 'ua-hidden';
}

/**
 * クラス名の先頭に「.」をつける。
 * @deprecated
 */
export const selector = (value: string): string => {
	return `.${value}`;
};
