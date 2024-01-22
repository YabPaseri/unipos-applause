import { DataAccessError } from '$error/DataAccessError';
import { AlarmDto } from '../dto';

/**
 * アラーム設定のDAO
 */
export class AlarmDao {
	private static RECORD_KEY = 'ALARM';
	constructor(private readonly area: chrome.storage.StorageArea) {}

	public async get(): Promise<AlarmDto[]> {
		try {
			const data = (await this.area.get(AlarmDao.RECORD_KEY))[AlarmDao.RECORD_KEY];
			if (data && Array.isArray(data)) return data;
			return [];
		} catch (error) {
			const opt: ErrorOptions | undefined = error instanceof Error ? { cause: error.cause } : void 0;
			throw new DataAccessError('Failed to select.', opt);
		}
	}

	public async upsert(o: AlarmDto) {
		try {
			const data = await this.get();
			const prev = data.find((d) => d.key === o.key);
			if (prev == null) {
				data.push(o);
			} else {
				Object.assign(prev, o);
			}
			await this.area.set({ [AlarmDao.RECORD_KEY]: data });
			return;
		} catch (error) {
			const opt: ErrorOptions | undefined = error instanceof Error ? { cause: error.cause } : void 0;
			throw new DataAccessError('Failed to upsert.', opt);
		}
	}
}
