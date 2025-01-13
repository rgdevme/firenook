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
import {
	authed,
	getSettingsStore,
	orm,
	pluginRoutes,
	pluginsFunctions,
	plugins as ps,
	state
} from './context'
import { ColorName, mantineColors } from './styles/colors'
import './styles/index.css'
import { resolvedTailwindTheme as theme } from './styles/resolvedTailwindConfig'
import { FirenookPluginFunction } from './types'

export * from './componets'
export * from './types'
export { getSettingsStore }
export const getFireborm = () => orm.get()

interface InitFirebormProps {
	config: FirebaseOptions
	settings?: FirebormSettings
	plugins?: FirenookPluginFunction[]
}

const initializeContext = async ({
	config,
	settings = {},
	plugins = []
}: InitFirebormProps) => {
	orm.set(new Fireborm(config, settings))
	pluginsFunctions.set(plugins)
	console.log('setting plugins functions')
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
	useAtomValue(ps)
	const routes = useAtomValue(pluginRoutes.atom)

	const fireborm = useAtomValue(orm.atom)
	const auth = getAuth(fireborm?.app)

	useEffect(() => {
		if (!auth) return
		const unsub = auth.onAuthStateChanged(user => authed.set(!!user))
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
