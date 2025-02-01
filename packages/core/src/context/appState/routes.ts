import { getAppState } from '.'
import { FirenookPlugin } from '../../types'
import { RouteElement } from '../app'

export const transformRoutes = ({
	routes,
	name
}: NonNullable<FirenookPlugin>): RouteElement[] => {
	if (!routes) return []
	return Object.entries(routes).map(([path, element]) => ({
		key: `${name}-${path}`,
		path,
		element
	}))
}

export const registerRoute = (route: RouteElement) => {
	const routesState = getAppState('routes')
	const routes = routesState.get()
	const exists = routes.some(r => r.path === route.path)
	if (exists) console.warn(`Route "${route.path}" already exits`)
	else routesState.set([...routes, route])
}
