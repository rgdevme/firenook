import { atom, createStore, SetStateAction, useAtom } from 'jotai'
import { AppState, AppStateContext, AppStateKey, AppStateParam } from './types'

export const state = createStore() as ReturnType<typeof createStore>
const registeredAppStateAtoms = atom({} as AppStateContext)
const getRegisteredAppStates = () => state.get(registeredAppStateAtoms)

export const getAppState = <Key extends AppStateKey = AppStateKey>(
	key: Key
) => {
	const appStates = getRegisteredAppStates()
	if (!(key in appStates)) console.error(`${key} state doesn't exist`)
	return appStates[key]! as AppState<FirenookAppStateContext[Key]>
}

export const useAppState = <Key extends AppStateKey = AppStateKey>(
	key: Key
) => {
	const appState = getAppState(key)
	return useAtom(appState.atom)
}

export const registerAppState = <Key extends AppStateKey = AppStateKey>(
	key: Key,
	value?: AppStateParam<FirenookAppStateContext[Key]>,
	override?: true
) => {
	const registered = getRegisteredAppStates()
	const exists = key in registered

	if (exists && !override) {
		throw new Error(`State ${key} already exists`)
	}

	const stateAtom = atom(value)
	state.set(registeredAppStateAtoms, {
		...registered,
		[key]: {
			atom: stateAtom,
			get: () => state.get(stateAtom),
			set: (update: SetStateAction<typeof value>) =>
				state.set(stateAtom, update)
		} as AppState<FirenookAppStateContext[typeof key]>
	})
	return stateAtom as AppState<FirenookAppStateContext[Key]>['atom']
}
