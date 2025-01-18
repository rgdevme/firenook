import {
	FirenookPluginFunction,
	getAppState,
	registerAppState
} from '@firenook/core'
import { FirebormStore } from 'fireborm'
import { CollectionData } from './types/collection'
import { Collection } from './views/collection'
import { CreateCollection } from './views/collection.create'
import { Document } from './views/document'
import { CreateDocument } from './views/document.create'
import { CollectionMenu } from './views/menu'

export const collectionsAtom = registerAppState<CollectionData[]>(
	'collections',
	[]
)

export const Collections: FirenookPluginFunction = () => {
	const store = getAppState<FirebormStore<{}>>('settingsStore').get()

	return {
		name: 'collections',
		routes: {
			['col/new']: () => <CreateCollection />,
			['col/:col_id/edit']: () => <CreateCollection edit />,
			['col/:col_id']: () => <Collection store={store} />,
			['col/:col_id/new']: () => <CreateDocument store={store} />,
			['col/:col_id/doc/:doc_id']: () => <Document store={store} />,
			['col/:col_id/sub/:sub_id']: () => <Collection store={store} />,
			['col/:col_id/sub/:sub_id/edit']: () => <CreateCollection edit />,
			['col/:col_id/sub/:sub_id/new']: () => <CreateDocument store={store} />,
			['col/:col_id/sub/:sub_id/:doc_id']: () => <Document store={store} />
		},
		menu: {
			collections: {
				element: () => <CollectionMenu />
			}
		}
	}
}
