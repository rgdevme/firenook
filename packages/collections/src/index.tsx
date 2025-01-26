import {
	FirenookPluginFunction,
	getAppState,
	registerAppState
} from '@firenook/core'
import { FirebormStore } from 'fireborm'
import { Collection } from './views/collection'
import { CreateCollection } from './views/collection.create'
import { CreateDocument } from './views/document.create'
import { CollectionMenu } from './views/menu'

import '@mantine/dates/styles.css' //if using mantine date picker features
import 'mantine-react-table/styles.css' //import MRT styles
import { createContext } from './context/collections'
import { registerProperties } from './context/propertySchema'

export const Collections: FirenookPluginFunction = () => {
	const store = getAppState<FirebormStore<{}>>('settingsStore').get()

	createContext()
	registerAppState('property_schema', new Map())
	registerProperties()

	return {
		name: 'collections',
		routes: {
			['col/new']: () => <CreateCollection />,
			['col/:col_id/edit']: () => <CreateCollection edit />,
			['col/:col_id']: () => <Collection store={store} />,
			['col/:col_id/new']: () => <CreateDocument />,
			['col/:col_id/doc/:doc_id']: () => <CreateDocument edit />
		},
		menu: {
			collections: { element: CollectionMenu }
		}
	}
}
