import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { BuildEnvironmentOptions, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const root = resolve(__dirname)
const external = [
	/firebase/,
	...Object.keys(pkg.devDependencies),
	...Object.keys(pkg.peerDependencies)
]

const buildOptions: BuildEnvironmentOptions = {
	lib: {
		entry: resolve(root, './src/index.tsx'),
		formats: ['cjs', 'es']
	},
	outDir: '../../../dist/bucket',
	emptyOutDir: false,
	minify: true,
	rollupOptions: {
		external,
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
	root: root,
	plugins: [
		dts({
			entryRoot: root,
			include: ['src'],
			rollupTypes: true
		}),
		react()
	],
	build: command === 'build' ? buildOptions : serveOptions
}))
