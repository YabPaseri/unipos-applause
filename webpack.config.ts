import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import sass from 'sass';
import { Configuration } from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config = (_env: any, argv: any): Configuration => {
	const IS_DEV = argv.mode === 'development';
	return {
		mode: IS_DEV ? 'development' : 'production',
		devtool: IS_DEV ? 'source-map' : void 0,
		node: {
			__dirname: false,
			__filename: false,
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, 'src'),
			},
			extensions: ['.js', '.ts'],
		},
		entry: {
			background: './src/background/index.ts',
			'content-script': './src/content-script/index.ts',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
			// clean: true,
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
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
								'@babel/preset-typescript',
							],
							plugins: ['@babel/plugin-transform-runtime'],
						},
					},
				},
				{
					test: /\.scss$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader },
						{ loader: 'css-loader' },
						{ loader: 'sass-loader', options: { implementation: sass, sassOptions: { fiber: false } } },
					],
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
			}),
		],
		optimization: {
			usedExports: true,
		},
	};
};

export default config;
