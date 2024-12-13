import { useList } from '@uidotdev/usehooks'
import { arrayUnion } from 'firebase/firestore'
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo
} from 'react'
import { useAppConfig } from '../firebase'
import { useCollectionStore } from '../firebase/models/Collection'
import { CollectionData } from '../firebase/types/Collection'

const CollectionCtx = createContext({
	collections: [] as CollectionData[],
	current: null as CollectionData | null,
	defaultData: {} as CollectionData | undefined,
	updateSchema: (async () => {}) as (
		schema: CollectionData['schema']
	) => Promise<void>,
	addCollection: (async () => {}) as (data: CollectionData) => Promise<void>
})

export const CollectionsProvider = ({ children }: PropsWithChildren) => {
	const { params } = useAppConfig()
	const [results, { set }] = useList<CollectionData>()
	const store = useCollectionStore()
	const { index, current } = useMemo(() => {
		const index = results.findIndex(x => x.path === params.cid)
		console.log(params)
		return {
			index: index < 0 ? null : index,
			current: index < 0 ? null : results[index]
		}
	}, [params.cid, results])

	useEffect(() => {
		const unsub = store?.subscribe('collections', {
			onChange: res => {
				if (!res?.collections) return
				set(res.collections)
			}
		})
		return () => unsub?.()
	}, [store?.ref.id])

	const updateSchema = async (schema: CollectionData['schema']) => {
		const upd = [...results]
		if (index === null) return
		upd[index].schema = schema
		await store?.save('collections', { collections: upd })
	}

	const addCollection = async (data: CollectionData) => {
		await store?.save('collections', { collections: arrayUnion(data) })
	}

	return (
		<CollectionCtx.Provider
			value={{
				defaultData: store?.defaultData.collections[0],
				collections: results,
				current,
				updateSchema,
				addCollection
			}}
			children={children}
		/>
	)
}

export const useCollectionsList = () => useContext(CollectionCtx)
