import { JSONRPCResult } from './jsonrpc-result';

export class JSONRPC {
	public static readonly call = async <T>(
		url: string,
		id: string,
		method: string,
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
				id,
				method,
				params,
			}),
		});
		const body = await fetch(request).then((res) => res.json());
		body.status = body.error ? 'error' : 'success';
		return body;
	};
}
