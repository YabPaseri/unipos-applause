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
}

/**
 * クラス名の先頭に「.」をつける。
 */
export const selector = (value: string): string => {
	return `.${value}`;
};
