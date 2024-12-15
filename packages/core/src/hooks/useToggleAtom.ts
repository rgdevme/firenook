import { PrimitiveAtom, useSetAtom } from 'jotai'

export const useToggleAtom = (atom: PrimitiveAtom<boolean>) => {
	const setAtom = useSetAtom(atom)
	return (value?: boolean) => {
		if (value !== undefined) setAtom(value)
		else setAtom(p => !p)
	}
}
