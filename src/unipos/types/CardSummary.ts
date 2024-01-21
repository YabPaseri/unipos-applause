import { Card } from './Card';

/**
 * 投稿情報  \
 * UniposAPI#getCards() で複数投稿を得る場合の戻り。
 * 「誰が何回拍手した」という情報が落ち、総拍手数と自分の拍手数が入っている。
 */
export type CardSummary = Omit<Card, 'praises'> & {
	/** 総拍手数 */
	praise_count: number;

	/** 自分の拍手数 */
	self_praise_count: number;
};
