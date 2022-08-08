/**
 * ユーザ情報
 */
export type TMember = {
	id: string;
	uname: string;
	display_name: string;
};

/**
 * Unipos.GetProfile で得られるログインユーザの情報。
 */
export type TMe = TMember & {
	created_at: number;
	pocket: {
		available_point: number;
		received_point: number;
		received_point_of_this_month: number;
		received_point_of_this_week: number;
	};
};
