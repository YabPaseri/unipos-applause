import { JSONRPCFailed } from '$/jsonrpc';
import { inspecter } from '$common/string-utils';
import { ExtensionError } from './ExtensionError';

/**
 * UniposAPIが返却したエラー
 */
export class UniposAPIError extends ExtensionError {
	static {
		this.prototype.name = 'UniposAPIError';
	}

	constructor(res: JSONRPCFailed, options?: ErrorOptions);
	constructor(message: string, options?: ErrorOptions);
	constructor(value: string | JSONRPCFailed, options?: ErrorOptions) {
		if (typeof value === 'string') {
			super(value, options);
		} else {
			super(`${value.error.code}: ${value.error.message} (id=${value.id}): ${inspecter(value.error.data)}`, options);
		}
	}
}
