import { FirenookPluginFunction } from '@firenook/core'
import { createContext } from './context/collections'
import { Collection } from './views/collection'
import { CreateCollection } from './views/collection.create'
import { CreateDocument } from './views/document.create'
import { CollectionMenu } from './views/menu'

declare global {
	interface FirenookAppStateContext {
		property_schema: Map<string, any>
	}
}

export const Collections: FirenookPluginFunction = () => {
	createContext()

	return {
		name: 'collections',
		routes: {
			['col/new']: () => <CreateCollection />,
			['col/:col_id/edit']: () => <CreateCollection edit />,
			['col/:col_id']: () => <Collection />,
			['col/:col_id/new']: () => <CreateDocument />,
			['col/:col_id/doc/:doc_id']: () => <CreateDocument edit />
		},
		menu: {
			collections: { element: CollectionMenu }
		}
	}
}
