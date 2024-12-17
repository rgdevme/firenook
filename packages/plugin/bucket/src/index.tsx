import { FirenookElements, FirenookPlugin, FirenookRoute } from '@firenook/core'
import { BucketsProvider } from './context/bucket'
import { BucketModal } from './views/Bucket/create'
import { BucketList } from './views/Bucket/list'
import { MenuItems } from './views/Plugin/menuItems'

export const PluginRoutes = {
	collection: new FirenookRoute({
		element: BucketList,
		path: 'b/:bid'
	})
} satisfies FirenookElements

export const BucketsPlugin: FirenookPlugin = () => ({
	name: 'fn-bucket-plugin',
	provider: ({ children, app }) => (
		<BucketsProvider app={app}>
			{children}
			<BucketModal />
		</BucketsProvider>
	),
	routes: PluginRoutes,
	menuItems: MenuItems
	// header: PluginControls
})
