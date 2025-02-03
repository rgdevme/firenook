import { Fireborm, FirebormStore } from 'fireborm'
import { FC } from 'react'
import { FieldsContext, registerAppState, registerField } from '.'
import { CheckboxField } from '../componets/property/checkbox'
import { NumberField } from '../componets/property/number'
import { StringField } from '../componets/property/string'
import { TextAreaField } from '../componets/property/textarea'

export type RouteElement = { path: string; element: FC; key: string }
export type MenuItemElement = { element: FC; key: string; priority: number }

declare global {
	interface FirenookAppStateContext {
		fireborm: Fireborm
		authed: boolean
		menuItems: MenuItemElement[]
		menuState: boolean
		routes: RouteElement[]
		settingsStore: FirebormStore<any>
		firenookFields: FieldsContext
	}
	interface FirenookFieldContext {
		string: StringField
		number: NumberField
		checkbox: CheckboxField
		textArea: TextAreaField
	}
}

export const initializeAppState = () => {
	const ormAtom = registerAppState('fireborm', new Promise(() => {}) as any)
	registerAppState('authed', false)
	registerAppState('menuItems', [])
	registerAppState('menuState', false)
	registerAppState('routes', [])
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
	registerAppState('firenookFields', new Map() as FieldsContext)
	registerField(StringField)
	registerField(NumberField)
	registerField(CheckboxField)
	registerField(TextAreaField)
}
