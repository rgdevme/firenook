import { registerAppState, useAppState } from '@firenook/core'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import {
	CollectionData,
	CollectionSchemaForm,
	CollectionSchemaProperty
} from '../types/collection'

declare global {
	interface FirenookAppStateContext {
		collections: CollectionData[]
	}
}

export const createContext = () => {
	registerAppState('collections', [], true)
}

export const useCollection = (path?: string) => {
	const { col_id } = useParams()
	const [collections] = useAppState('collections')
	const target = !!path?.length ? path : col_id
	const collection = target
		? collections.find(collection => collection.path === target)
		: undefined
	// Although path is always corretly defined, the user might access the
	// url manually and commit a typo, resulting in a possibly wrong col_id
	return collection
}

export const getDefaultDocumentData = (collection: CollectionData) => {
	const entries = collection.schema.map(prop => [prop.keyname, prop.value])
	return Object.fromEntries(entries) as Record<string, any>
}

export const getDefaultSchemaPropertyData =
	(): Required<CollectionSchemaForm> => ({
		type: 'string',
		keyname: '',
		label: '',
		description: '',
		value: '',
		isFilter: false,
		isArray: false,
		isNullable: true,
		isShown: true,
		isSort: true,
		side: 'left',
		id: crypto.randomUUID()
	})

export const useCollectionDetails = (collection?: CollectionData) => {
	const details = useMemo(() => {
		const res = { defaultData: {} as Record<string, any>, idOnly: true }
		if (!collection) return res
		res.defaultData = getDefaultDocumentData(collection)
		res.idOnly = !collection.schema.some(x => x.isShown)
		return res
	}, [collection])
	return details
}

export const useCollectionStore = () => {
	const [fireborm] = useAppState('fireborm')
	const collection = useCollection()
	const { defaultData, idOnly } = useCollectionDetails(collection)

	const store = useMemo(() => {
		if (!collection) return undefined

		return fireborm.createStore<any>({
			...collection,
			defaultData,
			toModel: doc => {
				const { id, ref } = doc
				let res = { id, _ref: ref }
				if (idOnly) return res
				return { ...res, ...doc.data() }
			},
			toDocument: ({ id, _ref, ...doc }) => doc
		})
	}, [collection])

	return { collection, store, defaultData, idOnly }
}

export const transformFormToSchema = ({
	description,
	id,
	isArray,
	isFilter,
	isNullable,
	isShown,
	isSort,
	keyname,
	label,
	side,
	type,
	value,
	...options
}: CollectionSchemaForm): CollectionSchemaProperty => ({
	input: { value },
	item: { keyname, type, description, label },
	extra: { id, side, isArray, isFilter, isNullable, isShown, isSort },
	options
})
