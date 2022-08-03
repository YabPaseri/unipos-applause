import { ApplauseError } from '../applause-error';
import JSONRPC, { JSONRPCSuccess } from '../jsonrpc';
import { UCard } from './u_card';
import { UMember } from './u_member';

type Empty = Record<string, never>;
export class UniposAPI {
	private static get token(): string {
		const token = window.localStorage.getItem('authnToken');
		if (!token) throw new ApplauseError('token not found.');
		return token;
	}

	private static call<T>(url: string, method: string, id: string, params: unknown): Promise<JSONRPCSuccess<T>> {
		return JSONRPC.call<T>(url, id, method, params, {
			'x-unipos-token': this.token,
		}).then((result) => {
			if (result.status === 'error') {
				// result.status === 'error' を Promise.reject に変換
				throw new ApplauseError(`unipos error: ${JSON.stringify(result.error)}`);
			}
			return result;
		});
	}

	public static getProfile(): Promise<JSONRPCSuccess<{ member: UMember }>> {
		const url = 'https://unipos.me/q/jsonrpc?method=Unipos.GetProfile';
		const method = 'Unipos.GetProfile';
		return this.call<{ member: UMember }>(url, method, method, {});
	}

	public static praise(card_id: string, count: number): Promise<JSONRPCSuccess<Empty>> {
		const url = 'https://unipos.me/c/jsonrpc?method=Unipos.Praise';
		const method = 'Unipos.Praise';
		return this.call<Empty>(url, method, `${method}_${card_id}_${count}`, {
			card_id,
			count,
		});
	}

	public static getCard(card_id: string): Promise<JSONRPCSuccess<UCard>> {
		const url = 'https://unipos.me/q/jsonrpc?method=Unipos.GetCard2';
		const method = 'Unipos.GetCard2';
		return this.call<UCard>(url, method, method, {
			id: card_id,
		});
	}
}
