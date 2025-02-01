import { ActionIcon, MantineProvider } from '@mantine/core'
import { FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { Fireborm, FirebormSettings } from 'fireborm'
import { Provider, useAtomValue } from 'jotai'
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { NotFound } from './componets/layout/404'
import { Loading } from './componets/layout/loading'
import { PrivateLayout } from './componets/layout/private'
import { PublicLayout } from './componets/layout/public'
import { getAppState, state, useAppState } from './context'
import { initializeAppState } from './context/app'
import { initializePlugin } from './context/plugin'
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

export interface FirenookProps extends InitFirebormProps {
	logo?: string
}

export const Firenook = ({
	logo,
	plugins = [],
	config,
	settings
}: FirenookProps) => {
	useEffect(() => {
		getAppState('fireborm').set(new Fireborm(config, settings))
		plugins.forEach(initializePlugin)
	}, [plugins, config, settings])

	return (
		<Provider store={state}>
			<MantineProvider
				theme={{
					colors: mantineColors,
					defaultRadius: 'md',
					components: {
						ActionIcon: ActionIcon.extend({
							defaultProps: { size: 'sm' }
						})
					},
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
	const fireborm = useAtomValue(getAppState('fireborm').atom)
	const [routes] = useAppState('routes')
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
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}
