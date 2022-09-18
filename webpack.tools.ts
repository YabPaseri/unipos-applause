import path from 'path';
import { CallableOption } from 'webpack-cli';

const option: CallableOption = () => {
	return {
		mode: 'development',
		devtool: false,
		resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
		entry: {
			tool: './src/tool.ts',
		},
		output: {
			path: path.resolve(__dirname, 'tools'),
			// library: 'unipos-api',
			// libraryTarget: 'umd',
			filename: '[name].js',
			// globalObject: 'window',
			clean: true,
		},
		module: {
			rules: [
				{
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
			],
		},
		// 高度な最適化（詳細オプション的）
		optimization: {
			// deadコードを削除する
			usedExports: true,
			minimize: true,
		},
	};
};

export default option;
