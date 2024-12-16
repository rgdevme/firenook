import react from '@vitejs/plugin-react'
import { BuildEnvironmentOptions, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const buildOptions: BuildEnvironmentOptions = {
	lib: {
		entry: './src/index.tsx',
		formats: ['cjs', 'es']
	},
	outDir: '../../dist',
	emptyOutDir: false,
	minify: true,
	rollupOptions: {
		external: [/firebase/, /fireborm/, /react/],
		output: { inlineDynamicImports: true }
	}
}

const serveOptions: BuildEnvironmentOptions = {
	watch: {
		buildDelay: 2000,
		clearScreen: true,
		include: 'src/**'
	}
}

export default defineConfig(({ command }) => ({
	root: './',
	plugins: [
		dts({
			entryRoot: './',
			include: ['src'],
			rollupTypes: true
		}),
		react()
	],
	optimizeDeps: {
		include: ['react/jsx-runtime']
	},
	build: command === 'build' ? buildOptions : serveOptions
}))
