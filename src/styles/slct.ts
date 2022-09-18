/**
 * 拡張機能が要素を探すために使用するクエリセレクタ
 */
export class SLCT {
	public static clsfy(...cls: string[]): string {
		return `.${cls.join('.')}`;
	}

	/**
	 * ページの変化を読み取れる要素
	 */
	public static readonly PAGE_TITLE = '.header_h1Container > div';

	/**
	 * タイムラインページであることを表す要素
	 */
	public static readonly TL_PROOF = '.module___pageNav--pageNav';

	/**
	 * タイムラインに存在する、投稿をまとめる親要素
	 */
	public static readonly TL_CARDS = '.card___card--cards';

	/**
	 * プロフィールページであることを表す要素
	 */
	public static readonly PF_PROOF = '.profile___profile--profileWrap';

	/**
	 * プロフィールに存在する、投稿をまとめる親要素
	 */
	public static readonly PF_CARDS = '.timeline-body > div';

	/**
	 * 設定ページであることを表す要素
	 */
	public static readonly MI_PROOF = '.memberInfo___memberInfo--memberInfo';

	/**
	 * 名投稿まとめページであることを表す要素
	 */
	public static readonly TH_PROOF = '.teamHighlights___teamHighlights--teamHighlights';

	/**
	 * サイドメニュー
	 */
	public static readonly SIDE_MENU = '.c-side';

	/**
	 * サイドメニューの閉じるボタン
	 */
	public static readonly SIDE_CLOSE = '.c-sideHamburgerBtn';

	/**
	 * ヘッダーのプロフィール
	 */
	public static readonly HEADER_PROFILE = '.c-headerProfile.headerProfile';

	/**
	 * ヘッダーのプロフィールアイコンを押すと出てくるメニューで、ログアウトのあるエリア
	 */
	public static readonly HEADER_PROFILE_LOGOUT_GROUP = '.c-headerProfile_menuGroup-includeLogout';

	/**
	 * ヘッダーのプロフィールアイコンを押すと出てくるメニューにある、設定ボタン
	 */
	public static readonly HEADER_PROFILE_MENU_CONFIG = '.c-headerProfile_menu-config';

	/**
	 * 全体を囲む親。
	 */
	public static readonly CONTENT = '#content';

	/**
	 * 右下に表示されるサポートのボタン
	 */
	public static readonly SUPPORT = '#launcher';
}
