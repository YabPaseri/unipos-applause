/**
 * 送信側が送る内容、受信側が受け取る内容 \
 * Send, Sent
 */
export type SContent = S_UpdateAlarm;

export type S_UpdateAlarm = {
	from: 'content';
	summary: 'update-alarm';
};
