/**
 * 受信側が返す内容、送信側が受け取る内容 \
 * 「R」eturn・「R」eceive
 */
export type RContent = R_UpdateAlarm;

export type R_UpdateAlarm = {
	from: 'service';
	summary: 'update-alarm';
	result: string;
};
