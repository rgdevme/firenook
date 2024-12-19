import {
	FirenookElements,
	FirenookPluginFunction,
	FirenookRoute
} from '@firenook/core'
import { FirebormStore } from 'fireborm'
import { CollectionProvider } from './context/collection'
import { CollectionsProvider } from './context/collections'
import { RecordProvider } from './context/record'
import { initCollectionStore } from './models/collections'
import { List } from './views/Collection/list'
import { CollectionModal } from './views/Modals/collection.create'
import { CollectionSchema } from './views/Modals/collection.schema'
import { CreateRecord } from './views/Modals/record.create'
import { PluginControls } from './views/Plugin/controls'
import { MenuItems } from './views/Plugin/menuItems'
import { RecordView } from './views/Record/view'

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

export const StoresPlugin: FirenookPluginFunction = ({ firestore }) => {
	const store = initCollectionStore(firestore) as unknown as FirebormStore

	return {
		name: 'fn-store-plugin',
		provider: ({ children, app }) => (
			<CollectionsProvider app={app} store={store}>
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
	}
}
