import { MantineProvider } from '@mantine/core'
import { FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { Fireborm, FirebormSettings } from 'fireborm'
import { Provider, useAtomValue } from 'jotai'
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'
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
import './index.css'
import { ColorName, mantineColors } from './styles/colors'
import { FirenookPluginFunction } from './types'

export * from './types'
export { getSettingsStore }
export const getFireborm = () => orm.get()

export const initializeFirenookConnection = (
	config: FirebaseOptions,
	settings: FirebormSettings
) => {
	orm.set(new Fireborm(config, settings))
}

export interface FirenookProps {
	logo?: string
	plugins: FirenookPluginFunction[]
}

const { theme } = resolveConfig(tailwindConfig)

export const Firenook = ({ logo, plugins }: FirenookProps) => {
	useEffect(() => {
		console.log('setting plugins functions')
		pluginsFunctions.set(plugins)
	}, [])

	return (
		<Provider store={state}>
			<MantineProvider
				theme={{
					colors: mantineColors,
					defaultRadius: 'xl',
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

	const { app } = useAtomValue(orm.atom)
	const auth = getAuth(app)

	useEffect(() => {
		console.log('auth changed')
		if (!auth) return
		const unsub = auth.onAuthStateChanged(user => authed.set(!!user))
		return unsub
	}, [auth])

	return (
		<Routes>
			<Route element={<PrivateLayout />}>
				<Route index element={<div>Private</div>} />
			</Route>
			<Route element={<PublicLayout />}>
				<Route path='login' element={<div>Public</div>} />
				{routes.map(({ element: E, key, path }) => (
					<Route key={key} path={path} element={<E />} />
				))}
			</Route>
		</Routes>
	)
}
