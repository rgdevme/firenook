import { NextUIProvider } from '@nextui-org/react'
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
import { AppConfigProps, AppConfigProvider } from './firebase'
import './index.css'
import { Path } from './routes'

const Routing = () => {
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
					<Route path={Path.BUCKET} element={<BucketList />} />
					<Route path={Path.COLLECTION} element={<List />} />
					<Route path={Path.RECORD} element={<RecordView />} />
					<Route path={Path.SUBCOLLECTION} element={<div>Subcollection</div>} />
				</Route>
			</Routes>
		</NextUIProvider>
	)
}

export const Firenook = (props: AppConfigProps) => {
	return (
		<BrowserRouter>
			<ParamsProvider>
				<AppConfigProvider {...props}>
					<CollectionsProvider>
						<BucketsProvider>
							<CollectionProvider>
								<RecordProvider>
									<Routing />
								</RecordProvider>
							</CollectionProvider>
						</BucketsProvider>
					</CollectionsProvider>
				</AppConfigProvider>
			</ParamsProvider>
		</BrowserRouter>
	)
}
