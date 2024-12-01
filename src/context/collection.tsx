import { FireBorm } from 'fireborm'
import {
	createContext,
	Dispatch,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react'
import { fireborm } from '../firebase'
import { useCollectionsList } from './collectionsList'
import { useParamsContext } from './params'

type FirebormStore = ReturnType<ReturnType<typeof FireBorm>['initializeStore']>

const CollectionCtx = createContext({
	store: null as null | FirebormStore,
	currentDoc: null as null | ReturnType<FirebormStore['docRef']>,
	count: 0,
	selection: new Set() as Set<string | number>,
	setSelection: (() => {}) as Dispatch<Set<string | number>>
})

export const CollectionProvider = ({ children }: PropsWithChildren) => {
	const { current } = useCollectionsList()
	const { params } = useParamsContext()
	const [store, setStore] = useState<null | FirebormStore>(null)
	const [currentDoc, setCurrentDoc] = useState<null | ReturnType<
		FirebormStore['docRef']
	>>(null)
	const [count /*, setCount */] = useState(0)
	const [selection, setSelection] = useState<Set<string | number>>(new Set())

	useEffect(() => {
		if (!current) return
		const newStore = fireborm.initializeStore({
			...current,
			toDocument: ({ _ref, id, ...doc }) => doc,
			toModel: doc => {
				const { id, ref } = doc
				// const data = doc.data()
				return { id, _ref: ref }
			}
		})
		setStore(newStore)
		// newStore.count(...[]).then(c => {
		// 	console.log({ c })
		// 	setCount(c)
		// })
	}, [current])

	useEffect(() => {
		if (!store || !params.record) return
		setCurrentDoc(store.docRef(params.record))
	}, [params.record])

	return (
		<CollectionCtx.Provider
			value={{
				store,
				currentDoc,
				count,
				selection,
				setSelection
			}}
			children={children}
		/>
	)
}

export const useCollection = () => useContext(CollectionCtx)
