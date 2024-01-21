import { Me } from './Me';

/**
 * ログインユーザのプロフィール
 */
export type Profile = {
	/** ログインユーザ情報 */
	member: Me;

	team: unknown;
	groups: unknown;
};
