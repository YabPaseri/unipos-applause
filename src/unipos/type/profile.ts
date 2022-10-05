import { Me } from './me';
import { Team } from './team';

export type Profile = {
	//groups

	/**
	 * 所属チーム情報
	 */
	team: Team;

	/**
	 * ログインユーザ情報
	 */
	member: Me;
};
