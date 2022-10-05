import { Card } from './card';

/**
 * Unipos.GetCards2 で投稿を得たときの、各投稿情報。\
 * 「誰が何回拍手を送った」という詳細な情報の代わりに、\
 * 全体の拍手数と、自分の拍手数が得られる。
 */
export type CardsItem = Omit<Card, 'praises'> & {
	/**
	 * 総拍手数
	 */
	praise_count: number;

	/**
	 * 自分の拍手数
	 */
	self_praise_count: number;
};
