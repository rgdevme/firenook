import {
	FirenookElements,
	FirenookPluginFunction,
	FirenookRoute
} from '@firenook/core'
import { BucketsProvider } from './context/bucket'
import { BucketModal } from './views/Bucket/create'
import { BucketList } from './views/Bucket/list'
import { MenuItems } from './views/Plugin/menuItems'
import { initBucketStore } from './model'
import { FirebormStore } from 'fireborm'

export const PluginRoutes = {
	buckets: new FirenookRoute({
		element: BucketList,
		path: 'b/:bid'
	})
} satisfies FirenookElements

export const BucketsPlugin: FirenookPluginFunction = ({ firestore }) => {
	const store = initBucketStore(firestore) as unknown as FirebormStore

	return {
		name: 'fn-bucket-plugin',
		provider: ({ children, app }) => (
			<BucketsProvider app={app} store={store}>
				{children}
				<BucketModal />
			</BucketsProvider>
		),
		routes: PluginRoutes,
		menuItems: MenuItems
		// header: PluginControls
	}
}
