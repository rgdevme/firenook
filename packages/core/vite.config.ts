import react from '@vitejs/plugin-react'
import chalk from 'chalk'
import { relative, resolve } from 'path'
import { BuildEnvironmentOptions, defineConfig } from 'vite'
import dts, { PluginOptions } from 'vite-plugin-dts'
import pkg from './package.json'

const root = resolve(__dirname)
const external = [
	/firebase/,
	...Object.keys(pkg.devDependencies),
	...Object.keys(pkg.peerDependencies)
]

// Reused by plugins. DO NOT CHANGE. Overwrite when used
export const dtsOptions = (rootPath: string): PluginOptions => ({
	entryRoot: rootPath,
	include: [resolve(rootPath, './src')],
	rollupTypes: true,
	logLevel: 'silent',
	afterBuild: emittedFiles => {
		const keys = [...emittedFiles.keys()]
		keys.forEach(k => {
			const filepath = relative(rootPath, k).split('\\')
			const file = filepath.pop()
			console.log(
				chalk.dim(filepath.join('/') + '/') +
					chalk.green(file) +
					chalk.dim('\tcreated')
			)
		})
	}
})

// Reused by plugins. DO NOT CHANGE. Overwrite when used
export const buildOptions = (rootPath: string) =>
	({
		lib: {
			entry: resolve(rootPath, './src/index.tsx'),
			name: 'index',
			fileName: 'index',
			formats: ['cjs', 'es']
		},
		outDir: './dist',
		emptyOutDir: true,
		minify: true,
		rollupOptions: {
			external,
			output: { inlineDynamicImports: true }
		}
	} satisfies BuildEnvironmentOptions)

export default defineConfig({
	root: root,
	plugins: [dts({ ...dtsOptions(root) }), react()],
	build: buildOptions(root)
})
