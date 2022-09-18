import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import sass from 'sass';
import { CallableOption } from 'webpack-cli';

/**
 * webpackの設定。\
 * コマンドライン引数で処理の分岐を行えるように、関数にしている。
 */
const option: CallableOption = (_env, argv) => {
	const IS_PROD = argv.mode === 'production';
	return {
		// ビルドのモード
		// webpackの幾つかの設定が最適化される
		// https://webpack.js.org/configuration/mode/
		mode: IS_PROD ? 'production' : 'development',

		// ソースマップの種類
		// evalを使うと、unsafe-evalをContent-Security-Policyに書かなければならないので
		// 使わないタイプを指定している
		// 本番ビルドでは作らない。
		// https://webpack.js.org/configuration/devtool/
		devtool: IS_PROD ? false : 'inline-source-map',

		resolve: {
			// 使用する拡張子
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},

		// バンドル処理の起点
		// https://webpack.js.org/configuration/entry-context/#entry
		entry: {
			'content-script': './src/content.ts',
		},

		// バンドル結果などの出力先
		// https://webpack.js.org/configuration/output/
		output: {
			path: path.resolve(__dirname, 'dist'),
			// [name] は entry で指定した {key: value} の key に置き換わる
			filename: '[name].js',
		},

		// モジュールに関する設定
		module: {
			rules: [
				{
					// ts ファイルを babel-loader で処理
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										targets: { chrome: '55', firefox: '52' },
										useBuiltIns: 'usage',
										corejs: 3,
										modules: false,
									},
								],
								['@babel/preset-react', { runtime: 'automatic' }],
								'@babel/preset-typescript',
							],
							plugins: [
								'@babel/plugin-transform-runtime',
								// https://mui.com/material-ui/guides/minimizing-bundle-size/#option-two-use-a-babel-plugin
								[
									'babel-plugin-import',
									{
										libraryName: '@mui/material',
										libraryDirectory: '',
										camel2DashComponentName: false,
									},
									'core',
								],
								[
									'babel-plugin-import',
									{
										libraryName: '@mui/icons-material',
										libraryDirectory: '',
										camel2DashComponentName: false,
									},
									'icons',
								],
							],
						},
					},
				},
				{
					// scss ファイルを 配列の後ろにある loader から処理
					// sass-loader: sass を css にコンパイルする
					// css-loader: import された css を js に埋め込む
					// MiniCssExtractPlugin: 埋め込まれた css を独立したファイルにする
					test: /\.scss$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader },
						{ loader: 'css-loader' },
						{ loader: 'sass-loader', options: { implementation: sass, sassOptions: { fiber: false } } },
					],
				},
			],
		},

		// プラグインの追加と設定
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
			}),
		],

		// 高度な最適化（詳細オプション的）
		optimization: {
			// deadコードを削除する
			usedExports: true,
		},
	};
};

export default option;
