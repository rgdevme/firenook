import react from '@vitejs/plugin-react'
import { BuildEnvironmentOptions, defineConfig } from 'vite'

const buildOptions: BuildEnvironmentOptions = {
	lib: {
		entry: './src/index.tsx',
		formats: ['cjs', 'es']
	},
	outDir: '../../../dist',
	emptyOutDir: false,
	minify: true
}

const serveOptions: BuildEnvironmentOptions = {
	watch: {
		buildDelay: 2000,
		clearScreen: true,
		include: 'src/**'
	}
}

export default defineConfig(({ command }) => ({
	plugins: [react()],
	build: command === 'build' ? buildOptions : serveOptions
}))
