import { MantineProvider } from '@mantine/core'
import { FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { Fireborm, FirebormSettings } from 'fireborm'
import { Provider, useAtomValue } from 'jotai'
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Loading } from './componets/layout/loading'
import { PrivateLayout } from './componets/layout/private'
import { PublicLayout } from './componets/layout/public'
import { getAppState, useAppState } from './context'
import {
	initializeAppState,
	MenuItemElement,
	RouteElement
} from './context/app'
import { state } from './context/utils'
import { ColorName, mantineColors } from './styles/colors'
import './styles/index.css'
import { resolvedTailwindTheme as theme } from './styles/resolvedTailwindConfig'
import { FirenookPluginFunction } from './types'

export * from './componets'
export * from './context'
export * from './types'

interface InitFirebormProps {
	config: FirebaseOptions
	settings?: FirebormSettings
	plugins?: FirenookPluginFunction[]
}

initializeAppState()

const initializeContext = async ({
	config,
	settings = {},
	plugins = []
}: InitFirebormProps) => {
	const results = await Promise.all(plugins.map(f => f()))
	const routes: RouteElement[] = []
	const menuItems: MenuItemElement[] = []

	results.forEach(({ name, routes: r = {}, menu: m = {} }) => {
		routes.push(
			...Object.entries(r).map(([path, element]) => ({
				key: `${name}-${path}`,
				path,
				element
			}))
		)
		menuItems.push(
			...Object.entries(m).map(([id, { element, priority = 10 }]) => ({
				key: `${name}-${id}`,
				element,
				priority
			}))
		)
	})

	getAppState('fireborm').set(new Fireborm(config, settings))
	getAppState('routes').set(routes)
	getAppState('menuItems').set(menuItems)
}

export interface FirenookProps extends InitFirebormProps {
	logo?: string
}

export const Firenook = ({
	logo,
	plugins,
	config,
	settings
}: FirenookProps) => {
	useEffect(() => {
		initializeContext({ config, settings, plugins })
	}, [plugins, config, settings])

	return (
		<Provider store={state}>
			<MantineProvider
				theme={{
					colors: mantineColors,
					defaultRadius: 'md',
					breakpoints: {
						xs: theme.screens.sm,
						sm: theme.screens.md,
						md: theme.screens.lg,
						lg: theme.screens.xl,
						xl: theme.screens['2xl']
					},
					fontFamily: theme.fontFamily.sans.join(', '),
					fontFamilyMonospace: theme.fontFamily.mono.join(', '),
					primaryColor: 'sky' as ColorName
				}}>
				<BrowserRouter>
					<Suspense fallback={<Loading />}>
						<App />
					</Suspense>
				</BrowserRouter>
			</MantineProvider>
		</Provider>
	)
}

const App = () => {
	const fireborm = useAtomValue(getAppState<Fireborm>('fireborm').atom)
	const [routes] = useAppState<RouteElement[]>('routes')
	const auth = !fireborm ? null : getAuth(fireborm?.app)

	useEffect(() => {
		if (!auth) return
		const unsub = auth.onAuthStateChanged(user =>
			getAppState('authed').set(!!user)
		)
		return unsub
	}, [auth])

	return (
		<Routes>
			<Route element={<PublicLayout />}>
				<Route path='login' element={<div>Public</div>} />
			</Route>
			<Route element={<PrivateLayout />}>
				<Route index element={<div>Private</div>} />
				{routes.map(({ element: E, key, path }) => (
					<Route key={key} path={path} element={<E />} />
				))}
			</Route>
		</Routes>
	)
}
