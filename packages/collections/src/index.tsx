import { FirenookPluginFunction, getAppState } from '@firenook/core'
import { Collection } from './views/collection'
import { CreateCollection } from './views/collection.create'
import { FirebormStore } from 'fireborm'
import { Document } from './views/document'
import { CreateDocument } from './views/document.create'
import { CollectionMenu } from './views/menu'

export const Collections: FirenookPluginFunction = () => {
	const store = getAppState<FirebormStore<{}>>('settingsStore').get()

	return {
		name: 'collections',
		routes: {
			['col/new']: () => <CreateCollection />,
			['col/:col_id/edit']: () => <CreateCollection edit />,
			['col/:col_id']: () => <Collection store={store} />,
			['col/:col_id/new']: () => <CreateDocument store={store} />,
			['col/:col_id/:doc_id']: () => <Document store={store} />,
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
