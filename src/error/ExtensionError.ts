/**
 * 拡張機能エラー
 */
export class ExtensionError extends Error {
	static {
		this.prototype.name = 'ExtensionError';
	}
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
