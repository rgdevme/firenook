import { Atom, atom, createStore, useAtom } from 'jotai'
import { SetStateAction } from 'react'

type AppStateParam<T> = T | ((get: <T>(atom: Atom<T>) => T) => T)

type AppState<T> = {
	atom: ReturnType<typeof atom<T>>
	get: () => T
	set: (update: SetStateAction<AppStateParam<T>>) => void
}

export const state = createStore() as ReturnType<typeof createStore>

const registeredAppStateAtoms = atom<Record<string, AppState<any>>>({})

const getRegisteredAppStates = () => state.get(registeredAppStateAtoms)

export const registerAppState = <T = undefined>(
	key: string,
	value?: AppStateParam<T>,
	override?: true
) => {
	const registered = getRegisteredAppStates()

	if (!override && key in registered) {
		throw new Error(`State ${key} already exists`)
	}

	console.log('state:', key, typeof value)

	const stateAtom = atom(value)
	state.set(registeredAppStateAtoms, {
		...registered,
		[key]: {
			atom: stateAtom,
			get: () => state.get(stateAtom),
			set: (update: SetStateAction<typeof value>) =>
				state.set(stateAtom, update)
		} as AppState<T>
	})
	return stateAtom as AppState<T>['atom']
}

export const getAppState = <T>(key: string) => {
	const atoms = getRegisteredAppStates()

	if (!(key in atoms)) {
		throw `${key} state doesn't exist`
	}
	return atoms[key] as AppState<T>
}

export const useAppState = <T>(key: string) => useAtom(getAppState<T>(key).atom)
