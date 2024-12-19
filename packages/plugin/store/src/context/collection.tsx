import { FirenookProvider } from '@firenook/core'
import { getCountFromServer, query } from 'firebase/firestore'
import {
	createContext,
	Dispatch,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { initGenericCollectionStore } from '../models/collection'
import { useCollections } from './collections'

const CollectionCtx = createContext({
	store: null as null | any,
	count: 0,
	list: [] as any[],
	selection: new Set() as Set<string>,
	setSelection: (() => {}) as Dispatch<Set<string>>
})

export const CollectionProvider: FirenookProvider = ({
	children,
	app: { firestore }
}) => {
	const { current } = useCollections()
	const store = useMemo(
		() => initGenericCollectionStore(current, firestore),
		[current]
	)
	const [count, setCount] = useState(0)
	const [list, setList] = useState<any[]>([])
	const [selection, setSelection] = useState(new Set<string>())

	useEffect(() => {
		if (!store) return
		const q = query(store.ref, ...[])
		getCountFromServer(q).then(res => {
			const count = res.data().count
			setCount(count)
		})
	}, [store])

	useEffect(() => {
		if (!store) return
		const unsub = store.subscribeMany({
			onChange: setList,
			where: []
		})
		return unsub
	}, [store])

	return (
		<CollectionCtx.Provider
			value={{
				store,
				list,
				count,
				selection,
				setSelection
			}}
			children={children}
		/>
	)
}

export const useCollection = () => useContext(CollectionCtx)
