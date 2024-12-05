import { NextUIProvider } from '@nextui-org/react'
import { FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
	BrowserRouter,
	Route,
	Routes,
	useHref,
	useNavigate
} from 'react-router'
import { List } from './components/Collection/list'
import { Login } from './components/Login'
import { Private, SignFlow } from './components/Routes'
import { Splash } from './components/Splash'
import { CollectionProvider } from './context/collection'
import { CollectionsProvider } from './context/collectionsList'
import './index.css'
import { ParamsProvider } from './context/params'
import { RecordView } from './components/Record/view'
import { RecordProvider } from './context/record'

const Routing = ({ app }: { app: FirebaseApp }) => {
	const auth = getAuth(app)
	const navigate = useNavigate()

	const [isAuthenticated, setIsAuthenticated] = useState(true)

	useEffect(() => {
		// if (!auth) return
		// const unsub = auth.onAuthStateChanged(user => setIsAuthenticated(!!user))
		// return unsub
	}, [])

	return (
		<NextUIProvider id='next-root' navigate={navigate} useHref={useHref}>
			<Routes>
				<Route index element={<Splash loading={!isAuthenticated} />} />
				<Route
					path='login'
					element={<SignFlow authenticated={isAuthenticated} />}>
					<Route index element={<Login />} />
				</Route>
				<Route path='/' element={<Private auth={{ isAuthenticated }} />}>
					<Route index element={<div className='firenook'>Welcome!</div>} />
					<Route path=':collection'>
						<Route index element={<List />} />
						<Route path=':record'>
							<Route index element={<RecordView />} />
							<Route
								path=':subcollection'
								element={<div className='firenook'>Subcollection view!</div>}
							/>
						</Route>
					</Route>
				</Route>
			</Routes>
		</NextUIProvider>
	)
}

export const Firenook = ({ app }: { app: FirebaseApp }) => {
	return (
		<ParamsProvider>
			<CollectionsProvider>
				<CollectionProvider>
					<RecordProvider>
						<BrowserRouter>
							<Routing app={app} />
						</BrowserRouter>
					</RecordProvider>
				</CollectionProvider>
			</CollectionsProvider>
		</ParamsProvider>
	)
}
