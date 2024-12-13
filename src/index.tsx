import { NextUIProvider } from '@nextui-org/react'
import { PropsWithChildren, useMemo } from 'react'
import {
	BrowserRouter,
	Route,
	Routes,
	useHref,
	useNavigate
} from 'react-router'
import { BucketList } from './components/Bucket/list'
import { Login } from './components/Login'
import { RecordView } from './components/Record/view'
import { Private, SignFlow } from './components/Routes'
import { Splash } from './components/Splash'
import { BucketsProvider } from './context/bucket'
import { CollectionProvider } from './context/collection'
import { RecordProvider } from './context/record'
import { AppConfigProps, AppConfigProvider, useAppConfig } from './firebase'
import { FirenookPlugin } from './plugins/core'
import { Path } from './routes'

import './index.css'

const Routing = () => {
	const app = useAppConfig()
	const navigate = useNavigate()

	return (
		<NextUIProvider id='next-root' navigate={navigate} useHref={useHref}>
			<Routes>
				<Route index element={<Splash />} />
				<Route path={Path.LOGIN} element={<SignFlow />}>
					<Route index element={<Login />} />
				</Route>
				<Route path='/' element={<Private />}>
					<Route path={Path.DASHBOARD} element={<div>Welcome!</div>} />
					{Object.values(app.routes.current).map(({ path, element: Elem }) => (
						<Route
							key={path}
							path={path}
							element={<Elem {...{ app, params: {} }} />}
						/>
					))}
					<Route path={Path.BUCKET} element={<BucketList />} />
					<Route path={Path.RECORD} element={<RecordView />} />
					<Route path={Path.SUBCOLLECTION} element={<div>Subcollection</div>} />
				</Route>
			</Routes>
		</NextUIProvider>
	)
}

export const Firenook = ({
	plugins = [],
	...props
}: AppConfigProps & { plugins: FirenookPlugin[] }) => {
	return (
		<BrowserRouter>
			<AppConfigProvider {...props}>
				<PluginsProvider plugins={plugins}>
					<BucketsProvider>
						<CollectionProvider>
							<RecordProvider>
								<Routing />
							</RecordProvider>
						</CollectionProvider>
					</BucketsProvider>
				</PluginsProvider>
			</AppConfigProvider>
		</BrowserRouter>
	)
}

const PluginsProvider = ({
	plugins,
	children: bottomChildren
}: PropsWithChildren<{
	plugins: FirenookPlugin[]
}>) => {
	const app = useAppConfig()

	return useMemo(
		() =>
			plugins
				.map(p => p(app))
				.reverse()
				.reduce((children, plugin) => {
					if (plugin.routes) app.registerRoutes(plugin.routes)
					if (!plugin?.provider) return children
					return <plugin.provider {...{ app, children }} />
				}, bottomChildren),
		[app]
	)
}
