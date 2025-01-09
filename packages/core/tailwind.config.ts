import type { Config } from 'tailwindcss'
import { tailwindColors } from './src/styles/colors'

export default {
	corePlugins: { preflight: false },
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: tailwindColors,
		extend: {}
	},
	plugins: [],
	darkMode: ['class', '[data-mantine-color-scheme="dark"]']
} satisfies Config
