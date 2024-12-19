import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { buildOptions, dtsOptions } from '../core/vite.config'

const root = resolve(__dirname)

export default defineConfig(async () => ({
	root: root,
	plugins: [dts(dtsOptions(root)), react()],
	build: await buildOptions(root)
}))
