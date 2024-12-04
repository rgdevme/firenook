import { equals } from 'ramda'
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { useCollection } from './collection'
import { Unsubscribe } from 'firebase/auth'
import { DocumentReference } from 'firebase/firestore'
import { useParamsContext } from './params'
import { useToggle } from '@uidotdev/usehooks'

const RecordContext = createContext(
	{} as {
		data: any
		changed: boolean
		loading: boolean
		update: (data: object) => void
		reset: (data?: object) => void
		clear: () => void
		remove?: () => Promise<void>
		save?: (upd: object) => Promise<void>
		copy?: (upd: object) => Promise<DocumentReference>
		subscribe?: (onChange: (res: object) => any) => Unsubscribe
	}
)

export const RecordProvider = ({ children }: PropsWithChildren) => {
	const {
		params: { record }
	} = useParamsContext()
	const [loading, toggle] = useToggle(true)
	const { store } = useCollection()
	const [original, setOriginal] = useState({})
	const [data, setData] = useState(original)
	const changed = useMemo(() => equals(data, original), [])

	const update = (data: object) => setData(p => ({ ...p, ...data }))

	const methods = useMemo(() => {
		if (!store || !record) return {}
		return {
			remove: () => store.destroy(record),
			save: (upd: typeof data) => store.save(record, upd),
			copy: (upd: typeof data) => store.create(upd),
			subscribe: (onChange: (res: any) => any) =>
				store.subscribe(record, { onChange })
		}
	}, [store, record])

	const clear = () => {
		toggle(true)
		setOriginal({})
	}

	const reset = (upd?: object) => {
		if (upd) {
			setOriginal(upd)
			setData(upd)
		} else setData(original)
		toggle(false)
	}

	useEffect(() => {
		reset()
	}, [original])

	const ctx = {
		data,
		changed,
		loading,
		update,
		reset,
		clear,
		...methods
	}

	return <RecordContext.Provider value={ctx} children={children} />
}

export const useRecord = () => useContext(RecordContext)
