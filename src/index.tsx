import { NextUIProvider } from '@nextui-org/react'
import { useToggle } from '@uidotdev/usehooks'
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
import { BucketList } from './components/Bucket/list'
import { List } from './components/Collection/list'
import { Login } from './components/Login'
import { RecordView } from './components/Record/view'
import { Private, SignFlow } from './components/Routes'
import { Splash } from './components/Splash'
import { BucketsProvider } from './context/bucket'
import { CollectionProvider } from './context/collection'
import { CollectionsProvider } from './context/collectionsList'
import { ParamsProvider } from './context/params'
import { RecordProvider } from './context/record'
import './index.css'

const Routing = ({ app }: { app: FirebaseApp }) => {
	const auth = getAuth(app)
	const navigate = useNavigate()
	const [loading, toggle] = useToggle(true)
	const [isAuthenticated, setIsAuthenticated] = useState(!auth)

	useEffect(() => {
		if (!auth) return
		const unsub = auth.onAuthStateChanged(user => {
			setIsAuthenticated(!!user)
			if (loading) toggle(false)
		})
		return unsub
	}, [])

	return (
		<NextUIProvider id='next-root' navigate={navigate} useHref={useHref}>
			<Routes>
				<Route
					index
					element={<Splash loading={loading} authenticated={isAuthenticated} />}
				/>
				<Route
					path='login'
					element={<SignFlow authenticated={isAuthenticated} />}>
					<Route index element={<Login />} />
				</Route>
				<Route path='/' element={<Private auth={{ isAuthenticated }} />}>
					<Route
						path='dashboard'
						element={<div className='firenook'>Welcome!</div>}
					/>
					<Route path='bucket/:path' element={<BucketList />} />
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
				<BucketsProvider>
					<CollectionProvider>
						<RecordProvider>
							<BrowserRouter>
								<Routing app={app} />
							</BrowserRouter>
						</RecordProvider>
					</CollectionProvider>
				</BucketsProvider>
			</CollectionsProvider>
		</ParamsProvider>
	)
}
