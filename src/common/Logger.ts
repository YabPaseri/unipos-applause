import { formatRFC3339 } from 'date-fns';
import { inspecter, snakeCase } from './string-utils';

export class Logger {
	public static level: LogLevel;
	private static readonly LEVELS = { TRACE: 1, DEBUG: 2, INFO: 3, WARN: 4, ERROR: 5, FATAL: 6 } as const;
	private static readonly STACK_REGEXP = /^(?:\s*)at (?:(.+) \()?(?:([^(]+?):(\d+):(\d+))\)?$/;

	public static getLogger(category?: string) {
		// UPPER_SNAKE_CASE
		return new Logger(category ? snakeCase(category).toUpperCase() : 'DEFAULT');
	}

	private constructor(public readonly category: string) {}

	private fulfilled(actual: LogLevel | 'MARK') {
		return import.meta.env.DEV || actual === 'MARK' || Logger.LEVELS[Logger.level] <= Logger.LEVELS[actual];
	}

	private switchFunc(level: LogLevel | 'MARK') {
		switch (level) {
			case 'TRACE':
				return console.debug;
			case 'INFO':
				return console.info;
			case 'WARN':
				return console.warn;
			case 'ERROR':
			case 'FATAL':
				return console.error;
			default:
				return console.log; // MARK or DEBUG
		}
	}

	private getCaller(error: Error) {
		// log4js-nodeの内部実装を参考にしている
		// https://github.com/log4js-node/log4js-node/blob/bd457888eb91b9e932fe8f66d720cf2d9d6442f4/lib/logger.js#L26
		const stacklines = error.stack?.split('\n').slice(3);
		if (!stacklines?.length) return '';

		const lineMatch = Logger.STACK_REGEXP.exec(stacklines[0]);
		if (lineMatch && lineMatch.length === 5) {
			/**
			 * callStack: stacklines.join('\n'),
			 * fileName: lineMatch[2],
			 * pathName: new URL(lineMatch[2]).pathname,
			 * lineNumber: parseInt(lineMatch[3], 10),
			 * columnNumber: parseInt(lineMatch[4], 10),
			 */
			return ` ${new URL(lineMatch[2]).pathname}:${parseInt(lineMatch[3], 10)}`;
		}
		return '';
	}

	private print(level: LogLevel | 'MARK', message: unknown, ...optionalParams: unknown[]) {
		if (!this.fulfilled(level)) return () => void 0;
		const now = formatRFC3339(new Date(), { fractionDigits: 3 });
		const caller = this.getCaller(new Error());
		const messages = [message, ...optionalParams]
			.map((v) => inspecter(v, { depth: null }))
			.filter((v) => v.length > 0)
			.join(' ');
		const content = `${now} ${level.padStart(5)} --- [${this.category}]${caller} : ${messages}`;
		this.switchFunc(level)(content);
	}

	public mark(message: unknown, ...optionalParams: unknown[]) {
		return this.print('MARK', message, ...optionalParams);
	}
	public trace(message: unknown, ...optionalParams: unknown[]) {
		return this.print('TRACE', message, ...optionalParams);
	}
	public debug(message: unknown, ...optionalParams: unknown[]) {
		return this.print('DEBUG', message, ...optionalParams);
	}
	public info(message: unknown, ...optionalParams: unknown[]) {
		return this.print('INFO', message, ...optionalParams);
	}
	public warn(message: unknown, ...optionalParams: unknown[]) {
		return this.print('WARN', message, ...optionalParams);
	}
	public error(message: unknown, ...optionalParams: unknown[]) {
		return this.print('ERROR', message, ...optionalParams);
	}
	public fatal(message: unknown, ...optionalParams: unknown[]) {
		return this.print('FATAL', message, ...optionalParams);
	}
}

export type LogLevel = keyof (typeof Logger)['LEVELS'];
