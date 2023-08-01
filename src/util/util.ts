/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as parseDateFns } from 'date-fns';

export class Util {
	public static readonly uuid = (): string => {
		let r = ';';
		for (const v of 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')) {
			if (v === 'x') {
				r += Math.floor(Math.random() * 16).toString(16);
			} else if (v === 'y') {
				r += (Math.floor(Math.random() * 4) + 8).toString(16);
			} else {
				r += v;
			}
		}
		return r;
	};

	public static isInvalidDate = (value: Date): boolean => {
		return Number.isNaN(value.getTime());
	};

	/**
	 * HHmmの形を満たしているかをチェックする。date-fnsを使用。
	 */
	public static readonly isTime = (value: string, throwable = false) => {
		const parsed = parseDateFns(value, 'HHmm', new Date());
		// NaNがnumberにおける特殊な値、みたいなのと同じで
		// Dateにも Invalid Date という特殊な値が居る。date-fnsはパース失敗時に Invalid Date で返してくる
		// 判断基準は、getTime(); のミリ秒値が NaN か否か。Invalid Date の時には NaN らしい。
		if (parsed instanceof Date && !this.isInvalidDate(parsed)) return true;
		if (throwable) throw new TypeError(`${value} is not matched HHmm format.`);
		return false;
	};

	/* eslint-disable @typescript-eslint/no-explicit-any */
	public static readonly any = (v: unknown): any => {
		return v as any;
	};
	/* eslint-enable @typescript-eslint/no-explicit-any */
}
