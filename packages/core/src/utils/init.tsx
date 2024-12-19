import { FunctionComponent } from 'react'
import {
	FirenookElements,
	FirenookPlugin,
	FirenookProvider
} from '../types/app'

export type PluginsOutput = {
	PluginsProvider: FirenookProvider
	menuItems: FunctionComponent<{}>[]
	header: FunctionComponent<{}>[]
	routes: FirenookElements
}

export const initializePlugins = (plugins: FirenookPlugin[]): PluginsOutput => {
	const header: FunctionComponent[] = []
	const menuItems: FunctionComponent[] = []
	let routes: FirenookElements = {}
	let PluginsProvider: FirenookProvider = ({ children }) => children

	plugins.forEach(({ provider: NewProvider, ...plugin }) => {
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

	return { PluginsProvider, menuItems, header, routes }
}
