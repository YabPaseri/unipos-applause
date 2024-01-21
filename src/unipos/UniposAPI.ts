import { JSONRPC, JSONRPCSuccess } from '$/jsonrpc';
import { Logger } from '$common/Logger';
import { UniposAPIError } from '$error/UniposAPIError';
import { Card, CardSummary, GetCardOptions, Member, Profile, Tokens } from './types';

declare const window: Window['window'] & {
	UniposAPI: unknown;
};

/**
 * UniposのAPI
 */
export class UniposAPI {
	/** 1投稿あたりの拍手が可能な回数 */
	public static readonly MAX_PRAISE_COUNT = 60;
	/** 1拍手あたりのポイント消費数 */
	public static readonly PRAISE_USED_POINT = 2;
	/** UniposAPIのエンドポイント */
	private static readonly END_POINT = 'https://unipos.me/jsonrpc';
	/** UniposのカードURLの正規表現(uuid-v4) */
	private static readonly CARD_LINK_REGEX = new RegExp(
		'^https://unipos.me/cards/([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})($|\\?.*$)',
	);
	/** ロガー */
	private static readonly logger = Logger.getLogger('LIBRARY');

	/**
	 * 処理を厳格にするフラグ(初期値: `true`)  \
	 * praiseが、送信する拍手数が1未満の時にはエラーを吐くようになる。
	 */
	public static strict = true;

	static {
		window.UniposAPI = this;
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

	/** UniposAPIの使用が可能か */
	public static get ready(): boolean {
		try {
			return !!this.accessToken && !!this.refreshToken;
		} catch {
			return false;
		}
	}

	private static async call<T>(method: string, id: string | null, params: unknown, refresh = true): Promise<JSONRPCSuccess<T>> {
		const url = `${this.END_POINT}?method=${method}`;
		const reqId = id || method;
		const call = () => JSONRPC.call<T>(url, method, reqId, params, { 'x-unipos-token': this.accessToken });
		this.logger.trace('request params =', { url, method, id: reqId, params });

		const res1 = await call();
		this.logger.trace('response1 =', res1);
		if (res1.status === 'success') {
			return res1;
		} else if (!refresh || res1.error.code !== -40000) {
			if (!refresh) this.logger.trace('Processing by the refresh token was interrupted by a flag.');
			throw new UniposAPIError(res1);
		}

		await this.tokenRefresh();
		const res2 = await call();
		this.logger.trace('response2 =', res2);
		if (res2.status === 'success') {
			return res2;
		} else {
			throw new UniposAPIError(res2);
		}
	}

	/** ログイン処理(Advanced Uniposでは未使用) */
	public static async login(email: string, password: string): Promise<void> {
		const res = await this.call<Tokens>('Unipos.Login', null, { email_address: email, password }, false);
		this.accessToken = res.result.authn_token;
		this.refreshToken = res.result.refresh_token;
	}

	/** トークン更新処理 */
	public static async tokenRefresh() {
		const res = await this.call<Tokens>('Unipos.RefreshToken', null, { authn_token: this.accessToken, refresh_token: this.refreshToken }, false);
		this.accessToken = res.result.authn_token;
		this.refreshToken = res.result.refresh_token;
	}

	/** ログインユーザプロフィール取得 */
	public static getProfile(): Promise<JSONRPCSuccess<Profile>> {
		return this.call<Profile>('Unipos.GetProfile', null, {});
	}

	/** ユーザ検索(ログインユーザ以外) */
	public static getMembersByNameWithFuzzySearch(name: string, limit = 20): Promise<JSONRPCSuccess<Member[]>> {
		return this.call<Member[]>('Unipos.GetMembersByNameWithFuzzySearch', null, { name, limit });
	}

	/** 投稿詳細取得 */
	public static getCard(card_id: string): Promise<JSONRPCSuccess<Card>> {
		return this.call<Card>('Unipos.GetCard2', null, { id: card_id });
	}

	/** 複数投稿取得(投稿日時降順) */
	public static getCards(count: number, offset_card_id?: string, options?: GetCardOptions): Promise<JSONRPCSuccess<CardSummary>> {
		return this.call<CardSummary>('Unipos.GetCards2', null, {
			...options,
			count,
			offset_card_id: offset_card_id ?? '',
		});
	}

	/** 拍手 */
	public static readonly praise = (card_id: string, count: number): Promise<JSONRPCSuccess<Empty>> => {
		// Uniposの仕様なのかバグなのか、その投稿への自身の拍手数が1未満にならなければcount < 1 でも拍手を送ることが出来てしまった。
		// 0は消費ポイントなし、0未満は投稿から拍手の取消となる。
		// 0未満を送ると、投稿からは拍手が消えるが、個々人の「もらったポイント」は変動しないような動きになっていた。
		// 1拍手(2ポイント)を3人に振り分けていたりするので、そのあたりの処理がややこしいのだろう。
		// なんだか怖いので、UniposAPIクラス側でも基本的に閉じるようにした。
		if (this.strict && count < 1) {
			throw new UniposAPIError('Cannot applaud less than one.');
		}
		const method = 'Unipos.Praise';
		const id = [method, card_id, count].join('_');
		return this.call<Empty>(method, id, { card_id, count });
	};

	/**
	 * Unipos上でカードのリンクをコピーした時に得られるURLからカードのIDを抽出する。非APIで正規表現で処理している。
	 */
	public static readonly extractCardIdFromCardLink = (url: string): string | undefined => {
		const match = url.match(this.CARD_LINK_REGEX);
		return match && match.length > 1 ? match[1] : void 0;
	};
}

type Empty = Record<string, never>; // {}
