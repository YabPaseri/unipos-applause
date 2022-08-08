import { TMember } from './member';
import { TPraise } from './praise';

/**
 * 各投稿の情報
 */
export type TCard = {
	id: string;
	message: string;
	point: number;
	from_member: TMember;
	to_members: TMember[];
	praises: TPraise[];
	created_at: number;
};

/**
 * Unipos.GetCards2 で複数投稿を得たときの、各投稿の情報\
 * 誰がどれだけ拍手を送った という情報が落ち、\
 * 代わりに総拍手数と、自分が送った拍手数が得られる。
 */
export type TCardsItem = Omit<TCard, 'praises'> & {
	praise_count: number;
	self_praise_count: number;
};
