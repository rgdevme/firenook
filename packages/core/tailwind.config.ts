import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { tailwindColors } from './src/styles/colors'

export default {
	corePlugins: { preflight: false },
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: tailwindColors,
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
				serif: ['"Newsreader"', ...defaultTheme.fontFamily.serif],
				mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: [],
	darkMode: ['class', '[data-mantine-color-scheme="dark"]']
} satisfies Config
