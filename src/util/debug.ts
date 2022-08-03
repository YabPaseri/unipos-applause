import { Options } from '../options';

export class DEBUG {
	static get log(): (...args: unknown[]) => void {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return Options.p.DEBUG ? console.log.bind(console, 'applause:') : () => {};
	}
}
