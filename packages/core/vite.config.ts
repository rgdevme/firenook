import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { dependencies, devDependencies } from './package.json'

const packages = [
	...new Set(
		Object.keys({ ...dependencies, ...devDependencies }).flatMap(key => {
			const [pkgroot] = key.split('/')
			const patterns = [key]
			if (pkgroot !== key) patterns.push(pkgroot)
			return patterns
		})
	)
].map(k => new RegExp(k))

export default defineConfig({
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
})
