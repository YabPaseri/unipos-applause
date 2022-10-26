import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import archive from './plugin/vite-plugin-archive';
import manifest from './plugin/vite-plugin-chrome-manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		// https://ja.reactjs.org/docs/optimizing-performance.html#rollup
		replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify(mode) }),
		react(),
		manifest(),
		archive(),
	],
	build: {
		lib: {
			formats: ['iife'],
			entry: 'src/content-script.ts',
			name: 'advanced_unipos',
			fileName: () => 'content-script.js', // formatsが1つなら、名前は固定でいいだろう。
		},
		minify: false,
	},
}));
