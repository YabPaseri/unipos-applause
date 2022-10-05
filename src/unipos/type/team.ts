/**
 * チーム情報
 */
export type Team = {
	/**
	 * チームID
	 */
	id: string;

	/**
	 * Uniposのチーム内での呼称
	 */
	name: string;

	full_name: string;

	/**
	 * チームの作成日時。\
	 * 投稿期間フィルタの最小値となる。
	 */
	created_at: number;
};
