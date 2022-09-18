import { TMe } from './member';
import { TTeam } from './team';

export type TProfile = {
	// groups
	team: TTeam;
	member: TMe;
};
