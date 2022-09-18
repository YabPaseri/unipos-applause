import { CLS } from '../styles';

export class Util {
	/**
	 * 引数が正の整数であるか
	 */
	public static isPositiveInt(v: unknown): boolean {
		return Number.isSafeInteger(v) && <number>v > 0;
	}

	/**
	 * 全角英数字を半角に変換する
	 */
	public static halve(v: string): string {
		return v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
	}

	/**
	 * eleの祖先を辿り、matchを満たす最初の要素を返す。存在しなければnull。
	 */
	public static ancestor(ele: HTMLElement, match: (e: HTMLElement) => boolean): HTMLElement | null {
		if (!document.contains(ele)) return null;
		let e: HTMLElement | null = ele.parentElement;
		while (e !== null) {
			if (match(e)) break;
			e = e.parentElement;
		}
		return e;
	}

	/**
	 * 厳密なparseIntを行う。\
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#a_stricter_parse_function
	 */
	public static parseInt(value: unknown): number {
		if (/^[-+]?(\d+|Infinity)$/.test(`${value}`)) {
			return Number(value);
		} else {
			return NaN;
		}
	}

	/**
	 * total を divisor の組み合わせに分ける。totalもdivisorも正の整数である必要がある。
	 * @example
	 * divide(9, [1,3,5]);  // {'5': 1, '3': 1, '1': 1};
	 * divide(18, [1,3,5]); // {'5': 3, '3': 1, '1': 0};
	 */
	public static divide(total: number, divisor: number[]): Map<number, number> {
		const result = new Map<number, number>();
		if (!this.isPositiveInt(total)) return result;
		let n = total;
		for (const i of Array.from(new Set(divisor)).sort((a, b) => b - a)) {
			if (!this.isPositiveInt(i)) continue;
			let c = 0;
			while (n - i >= 0) {
				n -= i;
				c++;
			}
			result.set(i, c);
		}
		if (n !== 0) result.set(1, n);
		return result;
	}

	/**
	 * uuid-v4
	 */
	public static uuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('').reduce((u, v) => {
			switch (v) {
				case 'x':
					return u + Math.floor(Math.random() * 16).toString(16);
				case 'y':
					return u + (Math.floor(Math.random() * 4) + 8).toString(16);
				default:
					return u + v;
			}
		}, '');
	}

	/**
	 * bodyに特定クラスを持つ要素を非表示にするクラスを付ける。\
	 * 引数がfalseなら外す。
	 */
	public static hidden(on = true) {
		const l = document.body.classList;
		if (on) l.add(CLS.HIDDEN_ROOT);
		else l.remove(CLS.HIDDEN_ROOT);
	}
}
