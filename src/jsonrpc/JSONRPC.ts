import { Logger } from '$common/Logger';
import { HTTPStatusError } from '$error/HTTPStatusError';
import { JSONRPCResult } from './JSONRPCResult';

export class JSONRPC {
	private static logger = Logger.getLogger('LIBRARY');
	public static async call<T>(
		url: string,
		method: string,
		id: string,
		params: unknown,
		headers?: Record<string, string>,
	): Promise<JSONRPCResult<T>> {
		const req = new Request(url, {
			method: 'POST',
			headers: { ...headers, 'content-type': 'application/json' },
			body: JSON.stringify({ jsonrpc: '2.0', method, id, params }),
		});
		this.logger.trace('request =', req);
		const res = await fetch(req);
		this.logger.trace('response =', res);
		if (res.ok) {
			const json: JSONRPCResultPseudo = await res.json();
			json.status = Object.hasOwn(res, 'error') ? 'failed' : 'success';
			return json as JSONRPCResult<T>;
		} else {
			throw new HTTPStatusError(res.status, res.statusText);
		}
	}
}

type JSONRPCResultPseudo = {
	status: JSONRPCResult<never>['status'];
};
