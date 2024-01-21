// 文字の表現方法(camel,snake,kebab)を扱う

/**
 * 文字列をワードの配列に分割する  \
 * ハイフン・アンダーバー・空白文字 が含まれている場合は、そこで区切る。  \
 * 含まれていない場合は、大文字の手前で区切る。  \
 * ただし、連続する大文字は、後ろのワードの一部となる。
 * @param value
 * @example
 * splitWord('hello-NewWorld'); // ['hello', 'NewWorld']
 * splitWord('helloNewWorld'); // ['hello', 'New', 'World']
 * splitWord('helloNEWWorld'); // ['hello', 'NEWWorld']
 */
export const separateWord = (value: string): string[] => {
	if (DELIMITER_SPLIT_REGEXP.test(value)) return value.split(DELIMITER_SPLIT_REGEXP);
	return value.split(UPPERCASE_SPLIT_REGEXP);
};

/**
 * 先頭が大文字のキャメルケースにする
 * @param value
 * @example
 * upperCamelCase('hello world'); // HelloWorld
 */
export const upperCamelCase = (value: string): string => {
	const words = separateWord(value);
	return words.map((w) => (w ? `${w[0].toUpperCase()}${w.substring(1).toLowerCase()}` : '')).join('');
};

/**
 * 先頭が小文字のキャメルケースにする
 * @param value
 * @example
 * lowerCamelCase('Hello World'); // helloWorld
 */
export const lowerCamelCase = (value: string): string => {
	const upper = upperCamelCase(value);
	return upper ? `${upper[0].toLowerCase()}${upper.substring(1)}` : '';
};

/**
 * 全て小文字のスネークケースにする
 * @param value
 * @example
 * snakeCase('hello World'); // hello_world
 */
export const snakeCase = (value: string): string => {
	const words = separateWord(value);
	return words.map((w) => w.toLowerCase()).join('_');
};

/**
 * 全て小文字のケバブケースにする
 * @param value
 * @example
 * kebabCase('hello World'); // hello-world
 */
export const kebabCase = (value: string): string => {
	const words = separateWord(value);
	return words.map((w) => w.toLowerCase()).join('-');
};

const DELIMITER_SPLIT_REGEXP = /[-_\s]/gm;
const UPPERCASE_SPLIT_REGEXP = /(?<![A-Z])(?=[A-Z])/gm;
