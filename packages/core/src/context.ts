import { Fireborm } from 'fireborm'
import { atom, createStore, ExtractAtomValue, SetStateAction } from 'jotai'
import { FirenookPluginFunction } from './types'
import { FC } from 'react'

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
			...Object.entries(m)
				.map(([id, { element, priority = 10 }]) => ({
					key: `${name}-${id}`,
					element,
					priority
				}))
				.sort((a, b) => a.priority - b.priority)
		)
	})

	pluginRoutes.set(routes)
	pluginMenu.set(menu)
})

export const authed = createAtom(false)
