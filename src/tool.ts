import UniposAPI from './unipos';

// ****************************************
//  拡張機能のビルドには含まれない。
//  動作検証用ツールをwindowに生やすjsを生成する。
//  開発者コンソールでファイルの内容をコピペ→実行で使用
// ****************************************

declare const window: Window['window'] & {
	U: UniposAPI;
};
window.U = UniposAPI;
