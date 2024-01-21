/**
 * Dateが `Invalid Date` であるかをチェックする。  \
 * isNaN の Date 版
 * @param value
 * @returns
 */
export const isInvalidDate = (value: Date): boolean => {
	return Number.isNaN(value.getTime());
};
