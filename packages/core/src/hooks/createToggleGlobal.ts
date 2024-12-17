import { atom, useAtomValue, useSetAtom } from 'jotai'

export const createGlobalToggle = (initial: boolean = false) => {
	const bool = atom(initial)

	const useToggle = () => {
		const setAtom = useSetAtom(bool)
		const toggle = (value?: boolean) => {
			if (value !== undefined) setAtom(value)
			else setAtom(p => !p)
		}
		return toggle
	}

	const useValue = () => useAtomValue(bool)

	return [useValue, useToggle] as [typeof useValue, typeof useToggle]
}
