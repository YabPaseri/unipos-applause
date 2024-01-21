import { FormatISOOptions, FormatOptions, ParseISOOptions, ParseOptions, formatISO, parse, parseISO, parseJSON, format } from 'date-fns';

/**
 * 拡張Dateクラス
 */
export class Dates extends Date {
	/**
	 * date-fnsを用いて日付をパースします
	 * @param dateStr 対象の文字列 (ex: 2023年1月2日)
	 * @param formatStr 日付フォーマット (ex: yyyy年M月d日)
	 * @param referenceDate 解析結果の足りない部分を補うDate (ex: 年月日を文字列から取得し、時分秒はDateから得る)
	 * @param options date-fns/parse のオプション
	 * @returns
	 */
	public static parseByFns(dateStr: string, formatStr: string, referenceDate: Date, options?: ParseOptions): Dates {
		return new Dates(parse(dateStr, formatStr, referenceDate, options));
	}

	/**
	 * date-fnsのparseISOを用いて日付をパースします
	 * @param argument
	 * @param options
	 * @returns
	 */
	public static parseISO(argument: string, options?: ParseISOOptions): Dates {
		return new Dates(parseISO(argument, options));
	}

	/**
	 * date-fnsのparseJSONを用いて日付をパースします
	 * @param dateStr
	 * @returns
	 */
	public static parseJSON(dateStr: string): Dates {
		return new Dates(parseJSON(dateStr));
	}

	/**
	 * date-fnsを用いて日付をフォーマットします
	 * @param formatStr 日付フォーマット (ex: yyyy年M月d日)
	 * @param options date-fns/format のオプション
	 * @returns
	 */
	public formatByFns(formatStr: string, options?: FormatOptions): string {
		return format(this, formatStr, options);
	}

	/**
	 * date-fnsのformatISOを用いて日付をフォーマットします
	 * @param options
	 * @returns
	 */
	public formatISO(options?: FormatISOOptions): string {
		return formatISO(this, options);
	}

	/**
	 * 同日時刻のインスタンスを新規に作成します
	 * @returns
	 */
	public clone(): Dates {
		return new Dates(this);
	}
}
