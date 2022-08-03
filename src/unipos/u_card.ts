import { UMember } from './u_member';

export type UCard = {
	id: string;
	point: number;
	praises: { count: number; member: UMember }[];
};
