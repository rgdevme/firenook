import { Firestore } from 'firebase/firestore'
import { FirebormStore } from 'fireborm'
import { BucketDefault, BucketDoc, BucketModel, BucketRef } from './type'

export const initBucketStore = (firestore?: Firestore) => {
	const store = new FirebormStore<
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

	store.init(firestore)

	return store
}
