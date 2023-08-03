import JSONRPC, { JSONRPCSuccess } from '../jsonrpc';
import { Empty } from '../type';
import { Card, CardsItem, Member, Profile } from './type';

declare const window: Window['window'] & {
	UniposAPI: unknown;
};

export class UniposAPI {
	public static readonly MAX_PRAISE_COUNT = 60;

	static {
		window.UniposAPI = UniposAPI;
	}

	private static get accessToken(): string {
		const token = window.localStorage.getItem('authnToken');
		if (!token) throw new ReferenceError('Access token not found.');
		return token;
	}
	private static set accessToken(v: string) {
		window.localStorage.setItem('authnToken', v);
	}
	private static get refreshToken(): string {
		const token = window.localStorage.getItem('refreshToken');
		if (!token) throw new ReferenceError('Refresh token not found.');
		return token;
	}
	private static set refreshToken(v: string) {
		window.localStorage.setItem('refreshToken', v);
	}

	public static get ready(): boolean {
		try {
			return this.accessToken !== this.refreshToken;
		} catch (error) {
			return false;
		}
	}

	/**
	 * リフレッシュトークンによるトークンの再発行を行う
	 */
	private static tokens(): Promise<JSONRPCSuccess<Tokens>> {
		return this.call<Tokens>('Unipos.RefreshToken', null, { authn_token: this.accessToken, refresh_token: this.refreshToken }, false);
	}

	private static async call<T>(method: string, id: string | null, params: unknown, refresh = true): Promise<JSONRPCSuccess<T>> {
		const url = 'https://unipos.me/jsonrpc?method=' + method;
		const call = (token: string) => JSONRPC.call<T>(url, method, id || method, params, { 'x-unipos-token': token });
		const res1 = await call(this.accessToken);
		// 成功
		if (res1.status === 'success') return res1;
		// トークン切れ以外のエラー or トークンの更新が不要
		else if (res1.error.code !== -40000 || !refresh) throw new Error(JSON.stringify(res1.error));
		// 以下、トークンを更新して再挑戦
		const tokens = await this.tokens();
		this.accessToken = tokens.result.authn_token;
		this.refreshToken = tokens.result.refresh_token;
		const res2 = await call(tokens.result.authn_token);
		if (res2.status === 'success') return res2;
		else throw new Error(JSON.stringify(res2.error));
	}

	/**
	 * ログインユーザの情報
	 */
	public static readonly getProfile = (): Promise<JSONRPCSuccess<Profile>> => {
		return this.call<Profile>('Unipos.GetProfile', null, {});
	};

	/**
	 * ユーザ検索(ログインユーザ以外)
	 */
	public static readonly getMembersByNameWithFuzzySearch = (name: string, limit = 20): Promise<JSONRPCSuccess<Member[]>> => {
		return this.call<Member[]>('Unipos.GetMembersByNameWithFuzzySearch', null, { name, limit });
	};

	/**
	 * 投稿詳細
	 */
	public static readonly getCard = (card_id: string): Promise<JSONRPCSuccess<Card>> => {
		return this.call<Card>('Unipos.GetCard2', null, { id: card_id });
	};

	/**
	 * 投稿日時の降順に投稿を複数得る
	 */
	public static readonly getCards = (count: number, offset_card_id?: string, options?: GetCardsOptions): Promise<JSONRPCSuccess<CardsItem[]>> => {
		return this.call<CardsItem[]>('Unipos.GetCards2', null, {
			...options,
			count,
			offset_card_id: offset_card_id || '',
		});
	};

	/**
	 * 投稿に拍手を送る
	 */
	public static readonly praise = (card_id: string, count: number): Promise<JSONRPCSuccess<Empty>> => {
		const method = 'Unipos.Praise';
		const id = [method, card_id, count].join('_');
		return this.call<Empty>(method, id, { card_id, count });
	};

	/**
	 * Unipos上でカードのリンクをコピーした時に得られるURLから、\
	 * カードのIDを抽出する。非API、正規表現で処理している。
	 */
	public static readonly extractCardIdFromCardLink = (url: string): string | undefined => {
		const match = url.match(this.CARD_LINK_REGEX);
		return match && match.length > 1 ? match[1] : void 0;
	};
	private static readonly CARD_LINK_REGEX = new RegExp(
		// uuid-v4 (8-4-4-4-12)
		'^https://unipos.me/cards/([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})($|\\?.*$)'
	);
}

type Tokens = { authn_token: string; refresh_token: string };

// to_member_id と from_member_id が共存出来ないなど、制限はあるようだ。
// しっかりとやるのであれば、JSONRPCResultのようなtype宣言が必要だが、
// 調べるのも面倒くさいので全部込み。
export type GetCardsOptions = {
	group_ids?: string[]; //       {id}の部署が関係する
	tag_name?: string; //          {name}のタグを持つ
	to_member_id?: string; //      {id}が受け取った
	from_member_id?: string; //    {id}が送った
	// 機能の提供が終了: https://support.unipos.me/hc/ja/articles/20356855590169
	// praised_member_id?: string; // {id}が拍手した
	duration?: {
		begin: number; //          {begin}から
		end: number; //            {end} までの期間
	};
};
