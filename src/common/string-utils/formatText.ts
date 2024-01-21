/**
 * 第1引数の文字列の {0},{1},... を、第2引数以降の値で置き換える  \
 * {}の中の数値は、第2引数で作られる配列のindexと一致する。  \
 * {0} のような文字列をそのまま表示したい場合は、  \
 * {{0}} のように二重にすることでエスケープされる。
 * @param format
 * @param args
 * @example
 */
export const formatText = (format: string, ...args: unknown[]) => {
	// formatText("{0} {1}", "{1}", 100); とされたときに
	// "100 100" ではなく "{1} 100" となるように、2回ループをかけている。
	const escape = (v: unknown) => `${v}`.replace(FORMAT_TEXT_ESCAPE_REGEXP, '{$&}');
	for (const [i, v] of args.entries()) {
		const r = new RegExp(`(?<!\\{)\\{${i}\\}(?!\\})`, 'g');
		format = format.replace(r, escape(v));
	}
	for (let i = 0; i < args.length; i++) {
		const r = new RegExp(`\\{\\{${i}\\}\\}`, 'g');
		format = format.replace(r, `{${i}}`);
	}
	return format;
};

const FORMAT_TEXT_ESCAPE_REGEXP = /(?<!\{)\{([1-9]\d*|0)\}(?!\})/g;
