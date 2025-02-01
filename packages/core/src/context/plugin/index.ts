import { FirenookPluginFunction } from '../../types'
import { registerMenuItem, transformMenuItems } from '../appState/menu'
import { registerRoute, transformRoutes } from '../appState/routes'

export const initializePlugin = async (
	pluginFunction: FirenookPluginFunction
) => {
	const plugin = await pluginFunction()
	console.log(`Firenook plugin "${plugin.name}" initialized`)
	if (plugin?.routes) transformRoutes(plugin).forEach(registerRoute)
	if (plugin?.menu) transformMenuItems(plugin).forEach(registerMenuItem)
}
