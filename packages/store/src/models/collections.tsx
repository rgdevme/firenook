import { Firestore } from 'firebase/firestore'
import { FirebormStore } from 'fireborm'
import {
	CollectionData,
	CollectionDefault,
	CollectionDoc,
	CollectionModel,
	CollectionRef,
	PropertyType
} from '../type'

export const initCollectionStore = (firestore?: Firestore) => {
	const store = new FirebormStore<
		CollectionDoc,
		CollectionModel,
		CollectionDefault,
		CollectionDefault
	>({
		singular: 'Collection',
		plural: 'Collections',
		path: '_settings',
		defaultData: {
			collections: [
				{
					customId: false,
					path: '',
					plural: '',
					singular: '',
					defaultData: {},
					schema: [
						{
							filterable: true,
							format: '',
							key: '',
							name: '',
							type: PropertyType.string,
							value: null,
							show: false,
							sortable: true,
							nullable: false,
							isArray: false
						}
					]
				}
			]
		},
		toDocument: ({ _ref, id, ...doc }) => doc,
		toModel: doc => {
			const { id, ref } = doc
			const data = doc.data()
			const defaultData = data.collections.reduce(
				(res, col) => [
					...res,
					{
						...col,
						defaultData: col.schema.reduce((object, property) => {
							object[property.key] = property.nullable ? null : property.value
							return object
						}, {} as object)
					}
				],
				[] as CollectionData[]
			)
			return { id, _ref: ref as CollectionRef, ...data, defaultData }
		}
	})

	store.init(firestore)

	return store
}
