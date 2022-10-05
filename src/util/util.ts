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
}
