import {
	DefaultMantineColor,
	MantineColorsTuple,
	MantineThemeColors,
	colorsTuple
} from '@mantine/core'
import chroma from 'chroma-js'
import colors from 'tailwindcss/colors'

const getShades = (hex: string) =>
	chroma.scale(['white', hex, 'black']).colors(10)

const pallete = {
	sky: colors.sky,
	emerald: colors.emerald,
	rose: colors.rose,
	amber: colors.amber,
	orange: colors.orange,
	fuchsia: colors.fuchsia,
	indigo: colors.indigo,
	teal: colors.teal,
	stone: colors.stone
} as const

export type ColorName = keyof typeof pallete
type ShadesNames =
	| keyof Omit<(typeof pallete)[ColorName], '50' | '950'>
	| 'DEFAULT'

type TailwindColors = {
	[name in ColorName]: { [shade in ShadesNames]: string }
}
type MantineColors = {
	[name in ColorName]: MantineColorsTuple
}

export const [mantineColors, tailwindColors] = Object.entries(pallete).reduce(
	(obj, [name, shades]) => {
		const middleShade = shades[500]
		const newShades = getShades(middleShade)

		obj[0][name] = newShades
		obj[1][name] = newShades.reduce(
			(newShades, shade, i) => ({ ...newShades, [i]: shade }),
			{ DEFAULT: middleShade } as TailwindColors[ColorName]
		)

		return obj
	},
	[{}, {}] as [MantineColors, TailwindColors]
)

type ExtendedCustomColors = ColorName | DefaultMantineColor

declare module '@mantine/core' {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedCustomColors, MantineColorsTuple>
	}
}
