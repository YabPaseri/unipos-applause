export * from './debug';

export default class Util {
	public static readonly halve = (value: string | null | undefined): string | null | undefined => {
		if (value !== void 0 && value !== null) {
			return value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
		}
		return value;
	};

	public static ancestor(ele: HTMLElement, match: (e: HTMLElement) => boolean): HTMLElement | undefined {
		if (!document.contains(ele)) return void 0;
		let e: HTMLElement | null = ele;
		while (e !== null) {
			if (match(e)) break;
			e = e.parentElement;
		}
		return e || void 0;
	}

	public static ancestorClass(ele: HTMLElement, classes: string[]): HTMLElement | undefined {
		return this.ancestor(ele, (e) => {
			return classes.filter((c) => !e.classList.contains(c)).length === 0;
		});
	}

	public static parseInt(value: unknown): number {
		if (/^[-+]?(\d+|Infinity)$/.test(`${value}`)) {
			return Number(value);
		} else {
			return NaN;
		}
	}
}
