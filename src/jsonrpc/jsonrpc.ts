import { JSONRPCResult } from './jsonrpc-result';

/**
 * JSON-RPC のリクエストを行う実装
 */
export class JSONRPC {
	public static async call<T>(
		url: string,
		id: string,
		method: string,
		params: unknown,
		headers?: Record<string, string>
	): Promise<JSONRPCResult<T>> {
		const request = new Request(url, {
			method: 'POST',
			headers: {
				...headers,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id,
				method,
				params,
			}),
		});
		const res_body: ResultPseudo = await fetch(request).then((res) => res.json());
		res_body.status = res_body.error ? 'failure' : 'success';
		return res_body as JSONRPCResult<T>;
	}
}

// 疑似レスポンス
type ResultPseudo = {
	result?: unknown;
	error?: unknown;
	status: 'success' | 'failure';
};
