import { Fireborm } from 'fireborm'
import { atom, createStore, SetStateAction } from 'jotai'
import { PluginFunction } from './types'

export const state = createStore() as ReturnType<typeof createStore>

const createAtom = <T>(value?: T) => {
	const atomAtom = atom(value!)
	const get = () => state.get(atomAtom)
	const set = (update: SetStateAction<NonNullable<T>>) => {
		state.set(atomAtom, update)
	}
	return { get, set, atom: atomAtom }
}

export const orm = createAtom<Fireborm>(undefined)
export const ormReady = atom(get => !!get(orm.atom))

export const pluginsFunctions = createAtom<PluginFunction[]>([])
export const pluginsReady = createAtom(false)
export const plugins = atom(get => {
	const ready = get(ormReady)
	if (!ready) return []
	pluginsReady.set(false)
	const functions = get(pluginsFunctions.atom)
	const result = functions.map(f => f())
	pluginsReady.set(true)
	return result
})
