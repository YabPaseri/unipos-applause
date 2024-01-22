/**
 * アラーム設定のDTO
 */
export type AlarmDto = {
	/** ユニークキー */
	key: string;

	/** 曜日(Date.prototype.getDay()に準ずる) */
	day: number;

	/** 時刻(HHmm) */
	time: string;

	/** 有効 */
	active: boolean;
};
