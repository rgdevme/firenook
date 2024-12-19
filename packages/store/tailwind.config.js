import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,ts,tsx,js,jsx}',
		'../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {}
	},
	darkMode: 'media',
	plugins: [nextui()]
}
