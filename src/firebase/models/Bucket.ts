import { fireborm } from '..'
import {
	BucketDefault,
	BucketDoc,
	BucketModel,
	BucketRef
} from '../types/Bucket'

export const BucketStore = fireborm.initializeStore<
	BucketDoc,
	BucketModel,
	BucketDefault,
	BucketDefault
>({
	singular: 'Bucket',
	plural: 'Buckets',
	path: '_buckets',
	defaultData: { buckets: [] },
	toDocument: ({ _ref, id, ...doc }) => doc,
	toModel: doc => {
		const { id, ref } = doc
		const data = doc.data()
		return { id, _ref: ref as BucketRef, ...data }
	}
})
