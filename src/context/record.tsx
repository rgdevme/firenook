import { useToggle } from '@uidotdev/usehooks'
import { Unsubscribe } from 'firebase/auth'
import { DocumentReference } from 'firebase/firestore'
import { equals } from 'ramda'
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react'
import { useAppConfig } from '../firebase'
import { useCollection } from './collection'

const RecordContext = createContext(
	{} as {
		data: Record<string, any>
		original: Record<string, any>
		changed: boolean
		loading: boolean
		update: (data: object) => void
		reset: (data?: object) => void
		clear: () => void
		remove: () => Promise<void> | undefined
		save: () => Promise<void> | undefined
		copy: () => Promise<DocumentReference> | undefined
		subscribe: () => Unsubscribe | undefined
	}
)

export const RecordProvider = (props: PropsWithChildren) => {
	const {
		params: { rid }
	} = useAppConfig()
	const [loading, toggle] = useToggle(true)
	const { store: s } = useCollection()
	const [original, setOriginal] = useState({})
	const [data, setData] = useState(original)
	const changed = useMemo(() => equals(data, original), [])

	// const setData = (d: object) => (data.current = d)
	const update = (d: object) => setData({ ...data, ...d })

	const copy = useCallback(() => s?.create(data), [s, data])
	const save = useCallback(
		() => (!rid ? undefined : s?.save(rid, data)),
		[s, rid, data]
	)
	const remove = useCallback(
		() => (!rid ? undefined : s?.destroy(rid)),
		[s, rid]
	)
	const subscribe = useCallback(
		() =>
			!rid
				? undefined
				: s?.subscribe(rid, {
						onChange: d => {
							setOriginal(d ?? {})
							toggle(false)
						}
				  }),
		[s, rid]
	)

	const clear = () => {
		toggle(true)
		setOriginal({})
	}

	const reset = (upd?: object) => {
		setData(upd ?? original)
	}

	useEffect(() => {
		setData(original)
	}, [original])

	const ctx = {
		data: data,
		original: original,
		changed,
		loading,
		update,
		reset,
		clear,
		save,
		copy,
		remove,
		subscribe
	}

	return <RecordContext.Provider value={ctx} {...props} />
}

export const useRecord = () => useContext(RecordContext)
