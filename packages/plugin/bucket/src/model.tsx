import { AppConfig } from '../../../core/src/context'
import { BucketDefault, BucketDoc, BucketModel, BucketRef } from './type'

export const initBucketStore = (fireborm: AppConfig['fireborm']) => {
	return fireborm?.initializeStore<
		BucketDoc,
		BucketModel,
		BucketDefault,
		BucketDefault
	>({
		singular: 'Bucket',
		plural: 'Buckets',
		path: '_settings',
		defaultData: { buckets: [] },
		toDocument: ({ _ref, id, ...doc }) => doc,
		toModel: doc => {
			const { id, ref } = doc
			const data = doc.data()
			return { id, _ref: ref as BucketRef, ...data }
		}
	})
}
