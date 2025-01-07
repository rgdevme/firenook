import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { dependencies } from './package.json'

const packages = Object.keys(dependencies).map(string => new RegExp(string))

export default defineConfig(({ command }) => ({
	root: './',
	plugins: [
		dts({
			include: ['./src'],
			rollupTypes: true,
			insertTypesEntry: true
		}),
		react()
	],
	build: {
		lib: {
			entry: './src/index.tsx',
			name: 'index',
			fileName: 'index',
			formats: ['cjs', 'es']
		},
		outDir: 'dist',
		emptyOutDir: false,
		minify: true,
		rollupOptions: { external: packages }
	}
}))
