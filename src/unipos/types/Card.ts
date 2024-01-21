import { Member } from './Member';

/**
 * 投稿情報
 */
export type Card = {
	/** 投稿ID */
	id: string;

	/** 投稿メッセージ */
	message: string;

	/** ポイント数 */
	point: number;

	/** おくった人 */
	from_member: Member;

	/** もらった人(たち) */
	to_members: Member[];

	/** 投稿日時 */
	created_at: number;
};
