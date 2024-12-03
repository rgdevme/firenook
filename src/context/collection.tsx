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
import { getCountFromServer, query, Timestamp } from 'firebase/firestore'
import { PropertyType } from '../firebase/types/Property'

type FirebormStore = ReturnType<ReturnType<typeof FireBorm>['initializeStore']>

const CollectionCtx = createContext({
	store: null as null | FirebormStore,
	currentDoc: null as null | ReturnType<FirebormStore['docRef']>,
	count: 0,
	selection: new Set() as Set<string>,
	setSelection: (() => {}) as Dispatch<Set<string>>
})

export const CollectionProvider = ({ children }: PropsWithChildren) => {
	const { current } = useCollectionsList()
	const { params } = useParamsContext()
	const [store, setStore] = useState<null | FirebormStore>(null)
	const [currentDoc, setCurrentDoc] = useState<null | ReturnType<
		FirebormStore['docRef']
	>>(null)
	const [count, setCount] = useState(0)
	const [selection, setSelection] = useState(new Set<string>())

	useEffect(() => {
		if (!current) return
		const newStore = fireborm.initializeStore({
			...current,
			toDocument: ({ _ref, id, ...doc }) => doc,
			toModel: doc => {
				const { id, ref } = doc
				const data = {} as any

				if (current.schema.some(x => x.show)) {
					const docData = doc.data()
					for (const key in docData) {
						const type = current.schema.find(s => s.key === key)!.type

						if (type === PropertyType.timestamp) {
							data[key] = (docData[key] as Timestamp).toDate()
						} else {
							data[key] = docData[key]
						}
					}
				}
				return { id, _ref: ref, ...data }
			}
		})
		setStore(newStore)

		const q = query(newStore.ref, ...[])
		getCountFromServer(q).then(res => {
			const count = res.data().count
			setCount(count)
		})

		// newStore
		// 	.count()
		// 	.then(c => {
		// 		console.log({ c })
		// 	})
		// 	.catch(console.error)
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
