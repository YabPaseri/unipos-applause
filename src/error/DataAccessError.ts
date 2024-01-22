import { ExtensionError } from '.';

/**
 * chrome.storageからデータの抽出が出来なかった場合のエラー
 */
export class DataAccessError extends ExtensionError {
	static {
		this.prototype.name = 'DataAccessError';
	}
}
