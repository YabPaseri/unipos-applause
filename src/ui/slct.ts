export const SLCT = {
	/**
	 * Uniposのサポートダイアログを開くボタンのiframe
	 */
	SUPPORT: '#launcher',

	/**
	 * メンバー検索をした際に追加される要素を特定するもの その1
	 */
	MEMBER_SEARCHED_ELE_1: 'div > script[src="https://tag.web.onesdata.com/od.js"]',
	/**
	 * メンバー検索をした際に追加される要素を特定するもの その2
	 */
	MEMBER_SEARCHED_ELE_2: 'div > script[src="https://b90.yahoo.co.jp/conv.js"]',
	/**
	 * メンバー検索をした際に追加される要素を特定するもの その3
	 */
	MEMBER_SEARCHED_ELE_3: 'div > script[src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"]',
} as const;
