import { MantineSize } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { resolvedTailwindTheme } from '../styles/resolvedTailwindConfig'

export const useIsBreakpoint = (
	screen: MantineSize,
	exact: boolean = false
) => {
	const size = useViewportSize()

	const sortedBreakpoints = [
		['xs', resolvedTailwindTheme.screens.sm],
		['sm', resolvedTailwindTheme.screens.md],
		['md', resolvedTailwindTheme.screens.lg],
		['lg', resolvedTailwindTheme.screens.xl],
		['xl', resolvedTailwindTheme.screens['2xl']]
	].map(x => [x[0], parseInt(x[1])] as [MantineSize, number])

	const screenIndex = sortedBreakpoints.findIndex(x => x[0] === screen)
	const breakpointIndex = sortedBreakpoints.findIndex(x => size.width <= x[1])

	return exact ? screenIndex === breakpointIndex : screenIndex < breakpointIndex
}
