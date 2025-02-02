import { FirenookProvider } from '@firenook/core'
import { useList } from '@uidotdev/usehooks'
import { arrayUnion } from 'firebase/firestore'
import { FirebormStore } from 'fireborm'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { CollectionData } from '../type'

const CollectionsCtx = createContext({
	collections: [] as CollectionData[],
	current: null as CollectionData | null,
	defaultData: {} as CollectionData | undefined,
	updateSchema: (async () => {}) as (
		schema: CollectionData['schema']
	) => Promise<void>,
	addCollection: (async () => {}) as (data: CollectionData) => Promise<void>
})

export const CollectionsProvider = ({
	children,
	app,
	store
}: Parameters<FirenookProvider>[0] & { store: FirebormStore }) => {
	const [results, { set }] = useList<CollectionData>()
	const { index, current } = useMemo(() => {
		const index = results.findIndex(x => x.path === app.params.cid)
		return {
			index: index < 0 ? null : index,
			current: index < 0 ? null : results[index]
		}
	}, [app.params, results])

	const updateSchema = async (schema: CollectionData['schema']) => {
		const upd = [...results]
		if (index === null) return
		upd[index].schema = schema
		await store?.save('collections', { collections: upd })
	}

	const addCollection = async (data: CollectionData) => {
		await store?.save('collections', { collections: arrayUnion(data) })
	}

	useEffect(() => {
		const unsub = store?.subscribe('collections', {
			onChange: res => {
				if (!res?.collections) return
				set(res.collections)
			}
		})
		return () => unsub?.()
	}, [store?.ref.id])

	// useEffect(() => {
	// 	console.log('Header should change')
	// 	console.log('Footer should change')
	// }, [Object.values(params)])

	return (
		<CollectionsCtx.Provider
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

export const useCollections = () => useContext(CollectionsCtx)
