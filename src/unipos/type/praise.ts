import { Member } from './member';

/**
 * 拍手情報
 */
export type Praise = {
	/**
	 * 回数
	 */
	count: number;

	/**
	 * 拍手をした人
	 */
	member: Member;
};
