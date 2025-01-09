import { Fireborm } from 'fireborm'
import { atom, createStore, ExtractAtomValue, SetStateAction } from 'jotai'
import { FC } from 'react'
import { FirenookPluginFunction } from './types'

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

const settingsStoreAtom = atom(get => {
	return get(orm.atom)?.createStore<any>({
		singular: 'Settings',
		plural: 'Settings',
		path: '_settings',
		defaultData: {},
		toDocument: ({ _ref, id, ...doc }) => doc,
		toModel: doc => {
			const { id, ref } = doc
			const data = doc.data()
			return { id, _ref: ref, ...data }
		}
	})
})

export const getSettingsStore = () => state.get(settingsStoreAtom)

export const pluginsFunctions = createAtom<FirenookPluginFunction[]>([])
export const pluginRoutes = createAtom<
	{ path: string; element: FC; key: string }[]
>([])
export const pluginMenu = createAtom<
	{ element: FC; key: string; priority: number }[]
>([])

export const plugins = atom(async get => {
	const ready = get(ormReady)
	if (!ready) return
	const functions = get(pluginsFunctions.atom)
	const results = await Promise.all(functions.map(f => f()))

	const routes: ExtractAtomValue<typeof pluginRoutes.atom> = []
	const menu: ExtractAtomValue<typeof pluginMenu.atom> = []

	results.forEach(({ name, routes: r = {}, menu: m = {} }) => {
		routes.push(
			...Object.entries(r).map(([path, element]) => ({
				key: `${name}-${path}`,
				path,
				element
			}))
		)
		menu.push(
			...Object.entries(m).map(([id, { element, priority = 10 }]) => ({
				key: `${name}-${id}`,
				element,
				priority
			}))
		)
	})

	pluginRoutes.set(routes)
	pluginMenu.set(menu.sort((a, b) => a.priority - b.priority))
})

export const authed = createAtom(false)
