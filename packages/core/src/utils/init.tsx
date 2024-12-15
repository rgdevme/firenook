import { FunctionComponent } from 'react'
import { FirenookElements, FirenookPlugin, FirenookProvider } from '../type'

export const initializePlugins = (
	plugins: FirenookPlugin[],
	config: Parameters<FirenookPlugin>[0]
) => {
	const header: FunctionComponent[] = []
	const menuItems: FunctionComponent[] = []
	let routes: FirenookElements = {}
	let PluginsProvider: FirenookProvider = ({ children }) => children

	if (!!plugins) {
		const initializedPlugins = plugins.map(p => p(config))
		initializedPlugins.forEach(({ provider: NewProvider, ...plugin }) => {
			if (plugin.routes) routes = plugin.routes
			if (plugin.menuItems) menuItems.push(plugin.menuItems)
			if (plugin.header) header.push(plugin.header)
			if (NewProvider) {
				const BottomProvider = PluginsProvider
				PluginsProvider = ({ app, children }) => (
					<NewProvider
						key={plugin.name}
						app={app}
						children={<BottomProvider app={app} children={children} />}
					/>
				)
			}
		})
	}

	return { PluginsProvider, menuItems, header, routes }
}
