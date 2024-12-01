import { fireborm } from '..'
import {
	CollectionDefault,
	CollectionDoc,
	CollectionModel,
	CollectionRef
} from '../types/Collection'
import { PropertyType } from '../types/Property'

export const CollectionStore = fireborm.initializeStore<
	CollectionDoc,
	CollectionModel,
	CollectionDefault,
	CollectionDefault
>({
	singular: 'Collection',
	plural: 'Collections',
	path: 'col',
	defaultData: {
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
				nullable: false
			}
		]
	},
	toDocument: ({ defaultData, _ref, id, ...doc }) => doc,
	toModel: doc => {
		const { id, ref } = doc
		const data = doc.data()
		const defaultData = data.schema.reduce((object, property) => {
			object[property.key] = property.nullable ? null : property.value
			return object
		}, {} as object)
		return { id, _ref: ref as CollectionRef, ...data, defaultData }
	}
})
