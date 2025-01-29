import { Atom, atom } from 'jotai'
import { SetStateAction } from 'react'

declare global {
	interface FirenookAppStateContext {}
}

type AtomGetter = <A extends Atom<any> = Atom<any>>(
	atom: A
) => typeof atom extends Atom<infer T> ? T : never

export type AppStateParam<T> = T | ((get: AtomGetter) => T | Promise<T>)

/** A Field is different from a Property Schema */
export type AppState<T = any> = {
	atom: ReturnType<typeof atom<T>>
	get: () => T
	set: (update: SetStateAction<AppStateParam<T>>) => void
}

export type AppStateKey = keyof FirenookAppStateContext
export type AppStateContext = Record<AppStateKey, AppState>
