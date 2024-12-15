import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => ({
	root: './',
	plugins: [
		react()
		// dts({
		// 	include: ['./src/index.tsx'],
		// 	rollupTypes: true,
		// 	insertTypesEntry: true
		// })
	],
	// optimizeDeps: {
	// 	include: ['react/jsx-runtime']
	// },
	build:
		command !== 'serve'
			? {
					lib: {
						entry: './src/index.tsx',
						// name: 'index',
						// fileName: 'index',
						formats: ['cjs', 'es']
					},
					outDir: 'dist',
					emptyOutDir: false,
					minify: true
					// rollupOptions: { external: [/firebase/] }
			  }
			: {
					watch: {
						buildDelay: 2000,
						clearScreen: true,
						include: 'src/**'
					}

					// outDir: 'dist',
					// emptyOutDir: false,
					// minify: true
					// rollupOptions: { external: [/firebase/] }
			  }
}))
