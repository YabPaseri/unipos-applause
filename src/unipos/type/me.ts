import { Member } from './member';

/**
 * ログインユーザの情報
 */
export type Me = Member & {
	/**
	 * ポイント情報
	 */
	pocket: {
		/**
		 * 今週の残ポイント
		 */
		available_point: number;

		/**
		 * 受け取ったポイント
		 */
		received_point: number;
		received_point_of_this_month: number;
		received_point_of_this_week: number;
	};
};
