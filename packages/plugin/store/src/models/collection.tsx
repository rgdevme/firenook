import { Firestore, Timestamp } from 'firebase/firestore'
import { FirebormStore } from 'fireborm'
import { CollectionData, PropertyType } from '../type'

export const initGenericCollectionStore = (
	current: CollectionData | null,
	firestore?: Firestore
) => {
	if (!current) return null

	const store = new FirebormStore({
		...current,
		toDocument: ({ _ref, id, ...doc }) => doc,
		toModel: doc => {
			const { id, ref } = doc
			const data = {} as any

			if (current.schema.some(x => x.show)) {
				const docData = doc.data()
				for (const key in docData) {
					const type = current!.schema.find(s => s.key === key)?.type
					if (!type) continue
					let value = docData[key]

					if (type === PropertyType.timestamp) {
						if (value === '') value = Timestamp.fromDate(new Date())
						data[key] = (value as Timestamp).toDate()
					} else {
						data[key] = value
					}
				}
			}
			return { id, _ref: ref, ...data }
		}
	})
	store.init(firestore)

	return store
}
