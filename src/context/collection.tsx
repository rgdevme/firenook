import { getCountFromServer, query, Timestamp } from 'firebase/firestore'
import { FireBorm } from 'fireborm'
import {
	createContext,
	Dispatch,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { fireborm } from '../firebase'
import { PropertyType } from '../firebase/types/Property'
import { useCollectionsList } from './collectionsList'

type FirebormStore = ReturnType<ReturnType<typeof FireBorm>['initializeStore']>

const CollectionCtx = createContext({
	store: null as null | FirebormStore,
	count: 0,
	selection: new Set() as Set<string>,
	setSelection: (() => {}) as Dispatch<Set<string>>
})

export const CollectionProvider = (props: PropsWithChildren) => {
	const { current } = useCollectionsList()
	const store = useMemo(
		() =>
			current &&
			fireborm.initializeStore({
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
			}),
		[current]
	)
	const [count, setCount] = useState(0)
	const [selection, setSelection] = useState(new Set<string>())

	useEffect(() => {
		if (!store) return
		const q = query(store.ref, ...[])
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
	}, [store])

	return (
		<CollectionCtx.Provider
			value={{
				store,
				count,
				selection,
				setSelection
			}}
			{...props}
		/>
	)
}

export const useCollection = () => useContext(CollectionCtx)
