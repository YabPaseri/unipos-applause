/**
 * メッセージのDTO
 */
export type MessageDto = UpdateAlarm | UpdatedAlarm;

/**
 * content⇒background  \
 * アラームの更新依頼
 */
type UpdateAlarm = { summary: 'UPDATE_ALARM' };

/**
 * background⇒content  \
 * アラームの更新完了通知
 */
type UpdatedAlarm = { summary: 'UPDATED_ALARM' };
