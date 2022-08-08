import { Options } from '../options';

/**
 * デバッグログ
 */
export class DEBUG {
	/**
	 * Options.DEBUG が有効な時だけ console.log する
	 */
	static get log(): (...args: unknown[]) => void {
		return Options.DEBUG ? console.log.bind(console, 'unipos-applause:') : () => void 0;
	}
}
