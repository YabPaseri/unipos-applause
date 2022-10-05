import { JSONRPCResult } from './jsonrpc-result';

/**
 * JSON-RPC のリクエスト
 */
export class JSONRPC {
	public static readonly call = async <T>(
		url: string,
		method: string,
		id: string,
		params: unknown,
		headers?: Record<string, string>
	): Promise<JSONRPCResult<T>> => {
		const request = new Request(url, {
			method: 'POST',
			headers: {
				...headers,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				method,
				id,
				params,
			}),
		});
		const res: ResultPseudo = await fetch(request).then((res) => res.json());
		res.status = res.error ? 'failed' : 'success';
		return <JSONRPCResult<T>>res;
	};
}

type ResultPseudo = {
	result?: unknown;
	error?: unknown;
	status: JSONRPCResult<never>['status'];
};
