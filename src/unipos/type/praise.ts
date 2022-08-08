import { TMember } from './member';

/**
 * 拍手の情報
 */
export type TPraise = {
	/** 回数 */
	count: number;
	/** 拍手をした人 */
	member: TMember;
};
