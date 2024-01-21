import { ExtensionError } from './ExtensionError';

/**
 * HTTPステータスエラー
 */
export class HTTPStatusError extends ExtensionError {
	static {
		this.prototype.name = 'HTTPStatusError';
	}

	constructor(status: number, statusText: string, options?: ErrorOptions) {
		super(`${status}: ${statusText}`, options);
	}
}
