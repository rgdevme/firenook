import { NextUIProvider } from '@nextui-org/react'
import {
	BrowserRouter,
	Route,
	Routes,
	useHref,
	useNavigate
} from 'react-router'
import { Login } from './components/Login'
import { Private, SignFlow } from './components/Routes'
import { Splash } from './components/Splash'
import { AppConfigProps, AppConfigProvider, useAppConfig } from './context'
import { Path } from './routes'

import './index.css'

export * from './type'
export * from './components'
export * from './hooks'

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
					{Object.values(app.routes).map(({ path, element: Elem }) => (
						<Route
							key={path}
							path={path}
							element={<Elem {...{ app, params: {} }} />}
						/>
					))}
					<Route path={Path.SUBCOLLECTION} element={<div>Subcollection</div>} />
				</Route>
			</Routes>
		</NextUIProvider>
	)
}

export const Firenook = (props: AppConfigProps) => {
	return (
		<BrowserRouter>
			<AppConfigProvider {...props}>
				<Routing />
			</AppConfigProvider>
		</BrowserRouter>
	)
}
