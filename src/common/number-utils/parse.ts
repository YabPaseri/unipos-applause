export const INT_REGEXP = /^[-+]?([1-9]\d*|0)$/;
export const FLOAT_REGEXP = /[-+]?([1-9]\d*|0)(\.\d+)?$/;

export const isInt = (v: string) => {
	return INT_REGEXP.test(v);
};

export const isNumber = (v: string) => {
	return FLOAT_REGEXP.test(v);
};

export const toInt = (v: string) => {
	return INT_REGEXP.test(v) ? Number(v) : Number.NaN;
};

export const toNumber = (v: string) => {
	return FLOAT_REGEXP.test(v) ? Number(v) : Number.NaN;
};
