import { FC } from 'react'
import { registerAppState } from './utils'
import { Fireborm } from 'fireborm'

export type RouteElement = { path: string; element: FC; key: string }
export type MenuItemElement = { element: FC; key: string; priority: number }

export const initializeAppState = () => {
	const ormAtom = registerAppState<Fireborm>(
		'fireborm',
		new Promise(() => {}) as any
	)
	registerAppState('ormReady', get => !!get(ormAtom))
	registerAppState('authed', false)
	registerAppState('menuItems', [] as MenuItemElement[])
	registerAppState('menuState', false)
	registerAppState('routes', [] as RouteElement[])
	registerAppState('settingsStore', async get => {
		const orm = get(ormAtom)
		return orm?.createStore<any>({
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
}
