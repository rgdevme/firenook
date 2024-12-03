import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react'
import { CollectionStore } from '../firebase/models/Collection'
import { CollectionModel } from '../firebase/types/Collection'
import { useParamsContext } from './params'

const col = CollectionStore

const CollectionCtx = createContext({
	collections: [] as CollectionModel[],
	current: null as CollectionModel | null
	// refetch: async () => {}
})

export const CollectionsProvider = ({ children }: PropsWithChildren) => {
	const { params } = useParamsContext()
	const [results, setResults] = useState([] as CollectionModel[])
	const [currentCollection, setCurrentCollection] =
		useState<null | CollectionModel>(null)

	// const getCollections = async () => {
	// 	if (!col) return
	// 	const res = await col.query({ where: [] })
	// 	console.log({ res })

	// 	setResults(res)
	// }

	useEffect(() => {
		const unsub = col.subscribeMany({ onChange: setResults, where: [] })
		return unsub
	}, [])

	useEffect(() => {
		const col = results.find(col => col.path === params?.collection)
		setCurrentCollection(col || null)
	}, [params.collection, results])

	return (
		<CollectionCtx.Provider
			value={{
				collections: results,
				current: currentCollection
				// refetch: getCollections
			}}
			children={children}
		/>
	)
}

export const useCollectionsList = () => useContext(CollectionCtx)
