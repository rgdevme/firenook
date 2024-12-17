import { buildOptions, dtsOptions } from '../../core/vite.config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const root = resolve(__dirname)
const external = [
	/firebase/,
	...Object.keys(pkg.devDependencies),
	...Object.keys(pkg.peerDependencies)
]

const buildOpts = buildOptions(root)
buildOpts.rollupOptions.external = external

export default defineConfig({
	root: root,
	plugins: [dts(dtsOptions(root)), react()],
	build: buildOpts
})
