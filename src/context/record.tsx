import { useToggle } from '@uidotdev/usehooks'
import { Unsubscribe } from 'firebase/auth'
import { DocumentReference } from 'firebase/firestore'
import { equals } from 'ramda'
import {
	createContext,
	MutableRefObject,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef
} from 'react'
import { Outlet } from 'react-router'
import { useCollection } from './collection'
import { useParamsContext } from './params'

const RecordContext = createContext(
	{} as {
		data: MutableRefObject<any>
		original: MutableRefObject<any>
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
		params: { record: r }
	} = useParamsContext()
	const [loading, toggle] = useToggle(true)
	const { store: s } = useCollection()
	const original = useRef({})
	const data = useRef(original.current)
	const changed = useMemo(() => equals(data, original), [])

	const setOriginal = (d?: object) => (original.current = d ?? {})
	const setData = (d: object) => (data.current = d)
	const update = (d: object) => setData({ ...data.current, ...d })

	const copy = useCallback(() => s?.create(data.current), [s, data.current])
	const save = useCallback(
		() => (!r ? undefined : s?.save(r, data.current)),
		[s, r, data.current]
	)
	const remove = useCallback(() => (!r ? undefined : s?.destroy(r)), [s, r])
	const subscribe = useCallback(
		() =>
			!r
				? undefined
				: s?.subscribe(r, {
						onChange: d => {
							setOriginal(d)
							toggle(false)
						}
				  }),
		[s, r]
	)

	const clear = () => {
		toggle(true)
		setOriginal({})
	}

	const reset = (upd?: object) => {
		setData(upd ?? original)
	}

	useEffect(() => {
		setData(original.current)
	}, [original.current])

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
