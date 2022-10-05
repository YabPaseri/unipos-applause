import { Preferences } from '../preferences';
import { LogLevel } from './log-level';

export class Logger {
	private static levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'] as const;
	private static table: { [K in LogLevel]: number } = { DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, FATAL: 5 };

	public static readonly level = {
		/**
		 * 引数がログレベルを表す文字か否か
		 */
		is: (str: string): str is LogLevel => {
			return str in this.table;
		},
		/**
		 * ログレベルを表す文字の一覧
		 */
		summary: this.levels.join(', '),
	} as const;

	private static log(level: LogLevel) {
		// 開発ビルドのときは、設定によらず全ログを表示する
		const fulfilled = import.meta.env.DEV || this.table[Preferences.log_level] <= this.table[level];
		return fulfilled ? console.log.bind(console, '👏', `[${level}]`) : () => void 0;
	}
	public static get debug() {
		return this.log('DEBUG');
	}
	public static get info() {
		return this.log('INFO');
	}
	public static get warn() {
		return this.log('WARN');
	}
	public static get error() {
		return this.log('ERROR');
	}
	public static get fatal() {
		return this.log('FATAL');
	}
}
