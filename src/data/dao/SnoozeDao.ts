import { DataAccessError } from '$error/DataAccessError';
import { SnoozeDto } from '../dto';

/**
 * スヌーズ設定のDAO
 */
export class SnoozeDao {
	private static RECORD_KEY = 'SNOOZE';
	constructor(private readonly area: chrome.storage.StorageArea) {}

	public async get(): Promise<SnoozeDto> {
		try {
			const data = (await this.area.get(SnoozeDao.RECORD_KEY))[SnoozeDao.RECORD_KEY];
			if (data) return data;
			return { interval: 5 }; // = 5分
		} catch (error) {
			const opt: ErrorOptions | undefined = error instanceof Error ? { cause: error.cause } : void 0;
			throw new DataAccessError('Failed to select.', opt);
		}
	}

	public async upsert(o: SnoozeDto) {
		try {
			await this.area.set({ [SnoozeDao.RECORD_KEY]: o });
			return;
		} catch (error) {
			const opt: ErrorOptions | undefined = error instanceof Error ? { cause: error.cause } : void 0;
			throw new DataAccessError('Failed to upsert.', opt);
		}
	}
}
