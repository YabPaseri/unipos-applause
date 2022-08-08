import JSONRPC, { JSONRPCSuccess } from '../jsonrpc';
import { Empty, TCard, TCardsItem, TProfile } from './type';
import { UniposAPIError } from './unipos-api-error';

export class UniposAPI {
	public static get PRAISE_LIMIT() {
		return 60;
	}

	/**
	 * ローカルストレージから、Uniposのアクセストークンを取得する。
	 */
	private static get token(): string {
		const token = window.localStorage.getItem('authnToken');
		if (!token) throw new UniposAPIError('Token not found.');
		return token;
	}

	/**
	 * UniposのAPI呼び出しにおける共通処理。
	 */
	private static call<T>(url: string, id: string, method: string, params: unknown): Promise<JSONRPCSuccess<T>> {
		return JSONRPC.call<T>(url, id, method, params, {
			'x-unipos-token': this.token,
		}).then((result) => {
			if (result.status === 'failure') {
				throw new UniposAPIError(`${result.error.code}: ${result.error.message}`);
			}
			return result;
		});
	}

	/**
	 * ログインユーザの情報を得る
	 */
	public static getProfile(): Promise<JSONRPCSuccess<TProfile>> {
		const url = 'https://unipos.me/q/jsonrpc?method=Unipos.GetProfile';
		const method = 'Unipos.GetProfile';
		return this.call(url, method, method, {});
	}

	/**
	 * 投稿の詳細情報を得る
	 * @param card_id 投稿のID
	 */
	public static getCard(card_id: string): Promise<JSONRPCSuccess<TCard>> {
		const url = 'https://unipos.me/q/jsonrpc?method=Unipos.GetCard2';
		const method = 'Unipos.GetCard2';
		return this.call(url, method, method, { id: card_id });
	}

	/**
	 * 複数の投稿を得る。
	 * @param count 取得数
	 * @param offset_card_id offsetとして使う投稿。この投稿は結果に含まれない。
	 * @param options 詳細オプション。上記2つ以外の設定。
	 */
	public static getCards(count: number, offset_card_id?: string, options?: GetCardsOptions): Promise<JSONRPCSuccess<TCardsItem[]>> {
		const url = 'https://unipos.me/q/jsonrpc?method=Unipos.GetCards2';
		const method = 'Unipos.GetCards2';
		return this.call(url, method, method, {
			...options,
			count,
			offset_card_id: offset_card_id || '',
		});
	}

	/**
	 * 投稿に拍手を送る
	 * @param card_id 投稿のID
	 * @param count 拍手の数
	 */
	public static praise(card_id: string, count: number): Promise<JSONRPCSuccess<Empty>> {
		const url = 'https://unipos.me/c/jsonrpc?method=Unipos.Praise';
		const method = 'Unipos.Praise';
		const id = [method, card_id, count].join('_');
		return this.call(url, id, method, { card_id, count });
	}
}

export type GetCardsOptions = {
	to_member_id?: string; //      {id}が受け取った
	from_member_id?: string; //    {id}が送った
	praised_member_id?: string; // {id}が拍手した
	duration?: {
		begin: number; //          {begin}から
		end: number; //            {end} までの期間
	};
};
