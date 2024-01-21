import inspect, { type Options as InspectOptions } from 'browser-util-inspect';

/**
 * 引数がリテラルの場合はそのまま文字列に、  \
 * それ以外の場合は inspect 関数に通して返す。
 * @param v
 * @param opt inspect関数に渡すオプションの一部
 * @returns
 */
export const inspecter = (v: unknown, opt?: { depth?: number | null; showHidden?: boolean }): string => {
	if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
		return v.toString();
	}
	if (v instanceof Error) {
		return v.stack ?? v.message;
	}
	return inspect(v, { ...(opt as InspectOptions) });
};
