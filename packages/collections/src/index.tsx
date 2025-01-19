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

import '@mantine/dates/styles.css' //if using mantine date picker features
import 'mantine-react-table/styles.css' //import MRT styles
import { NumberField, StringField } from './components/property'
import { registerPropertySchema } from './components/property/context'

export const Collections: FirenookPluginFunction = () => {
	const store = getAppState<FirebormStore<{}>>('settingsStore').get()

	registerAppState<CollectionData[]>('collections', [], true)
	registerAppState('property_schema', new Map())

	registerPropertySchema('string', {
		name: '',
		label: '',
		description: '',
		defaultValue: '',
		side: 'left',
		filterable: true,
		isArray: false,
		nullable: false,
		show: true,
		sortable: true,
		element: StringField
	})

	registerPropertySchema('number', {
		name: '',
		label: '',
		description: '',
		defaultValue: 0,
		side: 'left',
		filterable: true,
		isArray: false,
		nullable: false,
		show: true,
		sortable: true,
		element: NumberField
	})

	return {
		name: 'collections',
		routes: {
			['col/new']: () => <CreateCollection />,
			['col/:col_id/edit']: () => <CreateCollection edit />,
			['col/:col_id']: () => <Collection store={store} />,
			['col/:col_id/new']: () => <CreateDocument />,
			['col/:col_id/doc/:doc_id']: () => <CreateDocument edit />,
			['col/:col_id/sub/:sub_id']: () => <Collection store={store} />,
			['col/:col_id/sub/:sub_id/edit']: () => <CreateCollection edit />,
			['col/:col_id/sub/:sub_id/new']: () => <CreateDocument />,
			['col/:col_id/sub/:sub_id/:doc_id']: () => <Document store={store} />
		},
		menu: {
			collections: {
				element: () => <CollectionMenu />
			}
		}
	}
}
