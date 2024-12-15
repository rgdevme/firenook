import {
	FirenookElements,
	FirenookPlugin,
	FirenookRoute
} from '../../../core/src/type'
import { CollectionProvider } from './context/collection'
import { CollectionsProvider } from './context/collections'
import { RecordProvider } from './context/record'
import { MenuItems } from './views/Plugin/menuItems'
import { CollectionModal } from './views/Modals/collection.create'
import { List } from './views/Collection/list'
import { CollectionSchema } from './views/Modals/collection.schema'
import { CreateRecord } from './views/Modals/record.create'
import { RecordView } from './views/Record/view'
import { PluginControls } from './views/Plugin/controls'

export const PluginRoutes = {
	collection: new FirenookRoute({
		element: List,
		path: 'c/:cid'
	}),
	record: new FirenookRoute({
		element: RecordView,
		path: '/c/:cid/r/:rid'
	})
} satisfies FirenookElements

const StoresPlugin: FirenookPlugin = () => ({
	name: 'fn-store-plugin',
	provider: ({ children, app }) => (
		<CollectionsProvider app={app}>
			<CollectionProvider app={app}>
				<RecordProvider app={app}>
					{children}
					<CollectionModal />
					<CollectionSchema />
					<CreateRecord />
				</RecordProvider>
			</CollectionProvider>
		</CollectionsProvider>
	),
	routes: PluginRoutes,
	menuItems: MenuItems,
	header: PluginControls
})

export default StoresPlugin
