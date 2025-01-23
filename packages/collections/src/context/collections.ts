import { registerAppState, useAppState } from '@firenook/core'
import { Fireborm } from 'fireborm'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { CollectionData } from '../types/collection'

export const createContext = () => {
	registerAppState<CollectionData[]>('collections', [], true)
}

export const useCollections = () => useAppState<CollectionData[]>('collections')

export const useCurrentCollection = () => {
	const { col_id } = useParams()
	const [collections] = useCollections()
	return collections.find(x => x.path === col_id)
}

export const useCollectionStore = () => {
	const [fireborm] = useAppState<Fireborm>('fireborm')
	const collection = useCurrentCollection()
	const store = useMemo(
		() =>
			!collection
				? undefined
				: fireborm.createStore<any>({
						...collection,
						toModel: doc => {
							const { id, ref } = doc
							return {
								id,
								_ref: ref,
								...doc.data()
							}
						},
						toDocument: ({ id, _ref, ...doc }) => doc
				  }),
		[collection]
	)

	return { collection, store }
}
