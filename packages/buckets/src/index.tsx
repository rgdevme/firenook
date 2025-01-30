import { FirenookPluginFunction } from '@firenook/core'
import { createContext } from './context/buckets'
import { CreateBucket } from './views/bucket.create'
import { List } from './views/list'
import { BucketsMenu } from './views/menu'

declare global {
	interface FirenookAppStateContext {
		property_schema: Map<string, any>
	}
}

export const Buckets: FirenookPluginFunction = () => {
	createContext()

	return {
		name: 'buckets',
		routes: {
			['buc/new']: () => <CreateBucket />,
			['buc/:buc_id/edit']: () => <CreateBucket edit />,
			['buc/:buc_id']: () => <List />
		},
		menu: {
			collections: { element: BucketsMenu }
		}
	}
}
